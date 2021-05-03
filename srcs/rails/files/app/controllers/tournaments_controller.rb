class TournamentsController < ApplicationController
  before_action :set_tournament, only: %i[ show edit update destroy ]
  skip_before_action :verify_authenticity_token

  # GET /tournaments or /tournaments.json
  def index
    @tournaments = Tournament.all

    respond_to do |format|
        format.html { render :index }
        format.json { render json: @tournaments }
    end
  end

  # GET /tournaments/1 or /tournaments/1.json
  def show
    respond_to do |format|
        format.html { render :show }
        format.json { render json: @tournament }
    end
  end

  def members
    members = TournamentUser.where(tournament_id: params[:id]).order(wins: :desc, loses: :asc, score: :desc)
    render json: members
  end

  def matches
    matches = TournamentMatch.where(tournament_id: params[:id])
    render json: matches
  end

  # GET /tournaments/new
  def new
    @tournament = Tournament.new
  end

  # GET /tournaments/1/edit
  def edit
  end

  def curr_user_is_in_tournament
  user = TournamentUser.where(tournament_id: params[:id], user_id: current_user.id).first
  if user.present?
    return render json: 1
  else
    return render json: 0
  end
  end

  def join
    user = TournamentUser.where(tournament_id: params[:tournament_id], user_id: current_user.id).first
    if user.present?
      return render json: { error: "You are already in tournament" }, status: :unprocessable_entity
    end
    tournament_user = TournamentUser.create(tournament_id: params[:tournament_id], user_id: current_user.id)
    render json: tournament_user
  end

  def leave
    tournament = Tournament.where(id: params[:id]).first

    if tournament.nil?
      return render json: { error: "The tournament isn't exist" }, status: :unprocessable_entity
    elsif tournament.is_inprogress?
      return render json: { error: "The tournament has already started, you cannot leave" }, status: :unprocessable_entity
    else
      user = TournamentUser.where(tournament_id: params[:id], user_id: current_user.id).first
      if user.nil?
          return render json: { error: "You are not in the tournament" }, status: :unprocessable_entity
      end
      user.destroy
      return render json: { }, status: :ok
    end
end

  def create
    unless current_user.is_admin || current_user.is_moderator
      return render json: { error: "You don't have enough rights!" }, status: :unprocessable_entity
    end

  if params[:name] == ''
    return render json: { error: "Fill the name field" }, status: :unprocessable_entity
  end

  if params[:name].size > 30
    return render json: { error: "Name is to long, it should be shorter than 30 " }, status: :unprocessable_entity
  end
  
    unless Tournament.where(name: params[:name]).empty?
       return render json: { error: "This name is already in use" }, status: :unprocessable_entity
    end

     if params[:name].size > 30
        return render json: { error: "Name is to long, it should be shorter than 30 " }, status: :unprocessable_entity
    end

    if params[:prize].to_i > 1000 || params[:prize].to_i < 0
      return render json: { error: 'Prize should be between 0 and 1000 points' }, status: :unprocessable_entity
    end

    if params[:date_end] == '' || params[:date_start] == '' || params[:time_end] == '' || params[:time_start] == ''
      return render json: { error: 'Invalid date' }, status: :unprocessable_entity
    end

    date_start = Date.parse params[:date_start]
    time_start = Time.parse params[:time_start]
    tournament_start = DateTime.new(date_start.year, date_start.month, date_start.day, time_start.hour, time_start.min) - 3.hour

    date_end = Date.parse params[:date_end]
    time_end = Time.parse params[:time_end]
    tournament_end = DateTime.new(date_end.year, date_end.month, date_end.day, time_end.hour, time_end.min) - 3.hour

    if tournament_end - tournament_start < 0 || tournament_start - DateTime.now < 0 || tournament_end - DateTime.now < 0
      return render json: { error: 'Dates are invalid' }, status: :unprocessable_entity
    end

    @tournament = Tournament.new(name: params[:name], start: tournament_start, end: tournament_end, prize: params[:prize])
    
    if @tournament.save
      if (params[:color] == "disco")
        @tournament.addons.addon1 = true
      elsif (params[:color] == "epilepsy")
        @tournament.addons.addon2 = true
      end

      if (params[:boost] == "boost")
        @tournament.addons.addon3 = true
      end
      @tournament.addons.save

    TournamentUpdateJob.set(wait_until: @tournament.start).perform_later(@tournament, "start")
    TournamentUpdateJob.set(wait_until: @tournament.end).perform_later(@tournament, "end")
  #   NotificationJob.perform_later({
  #   user: @tournament.guild2.owner,
  #   message: "The #{@tournament.guild1.name} guild has declared tournament on you",
  #   link: "/tournaments/"
    #   })
      render json: @tournament, status: :created
    else
      render json: @tournament.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /tournaments/1 or /tournaments/1.json
  def update
    respond_to do |format|
      if @tournament.update(tournament_params)
        format.html { redirect_to @tournament, notice: "Tournament was successfully updated." }
        format.json { render :show, status: :ok, location: @tournament }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @tournament.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /tournaments/1 or /tournaments/1.json
  def destroy
    @tournament.destroy
    respond_to do |format|
      format.html { redirect_to tournaments_url, notice: "Tournament was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  def result
    @tournament = TournamentUser.where(tournament_id: params[:id]).order(wins: :desc, loses: :asc, score: :desc)
    render json: @tournament
  end 

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_tournament
      @tournament = Tournament.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def tournament_params
      params.require(:tournament).permit(:prize, :start, :end, :name, :addons_id)
    end
end
