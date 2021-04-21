class MatchesController < ApplicationController
  before_action :set_match, only: %i[ show edit update match_users_update ]

  skip_before_action :verify_authenticity_token

  # GET /matches or /matches.json
  def index
    @matches = Match.where("player2_id IS NOT NULL").order("#{:id} desc")

    respond_to do |format|
      format.html { @matches }
      format.json { render json: @matches}
    end
  end

  def users_matches
    id = params[:id]
    @matches = Match.where("CASE WHEN player1_id = #{id} OR player2_id = #{id} THEN TRUE ELSE FALSE END").order("#{:id} desc")
    respond_to do |format|
      format.html { @matches }
      format.json { render json: @matches}
    end
  end

  # получить матч и игроков
  def match_users
    @match = Match.find(params[:id])
    @match.current_user = current_user
    @match.save
    render json: @match
  end

  def get_player
    player = User.find(params[:id])
    render json: player
  end

  # обновление модели
  def match_users_update
    respond_to do |format|
      if @match.update(match_params)
        format.html { redirect_to @match, notice: "War was successfully updated." }
        format.json { render json: @match}
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @match.errors, status: :unprocessable_entity }
      end
    end
  end

  # GET /matches/1 or /matches/1.json
  def show
  end

  # GET /matches/new
  def new
    @match = Match.new
  end

  # GET /matches/1/edit
  def edit
  end

  def new_match
    player2 = User.find_by(nickname: params[:player2])
    if (player2)
      player1_id = current_user.id
      player2_id = player2.id
      guild_1_id = current_user.guild_id
      guild_2_id = player2.guild_id

      @match = Match.new(player1_id: player1_id, player2_id: player2_id, guild_1_id: guild_1_id, guild_2_id: guild_2_id)
      respond_to do |format|
        if @match.save
          format.html { redirect_to @match, notice: "Match was successfully created." }
          format.json { render :show, status: :created, location: @match }

        else
          format.html { render :new, status: :unprocessable_entity }
          format.json { render json: @match.errors, status: :unprocessable_entity }
        end
      end
    else
      respond_to do |format|
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: { error: 'There is no such a user' }, status: :unprocessable_entity, errorText: "sss" }
      end
    end
  end

  def new_match_profile
    player2 = User.find_by(id: params[:id])
    if (player2)
      player1_id = current_user.id
      player2_id = player2.id
      guild_1_id = current_user.guild_id
      guild_2_id = player2.guild_id

      @match = Match.new(player1_id: player1_id, player2_id: player2_id, guild_1_id: guild_1_id, guild_2_id: guild_2_id)
      respond_to do |format|
        if @match.save
          NotificationChannel.broadcast_to(player2, message: "You will be invited to game with #{current_user.nickname}")
          format.html { redirect_to @match, notice: "Match was successfully created." }
          format.json { render json: @match}
        else
          format.html { render :new, status: :unprocessable_entity }
          format.json { render json: @match.errors, status: :unprocessable_entity }
        end
      end
    else
      respond_to do |format|
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: { error: 'There is no such a user' }, status: :unprocessable_entity, errorText: "sss" }
      end
    end
  end

  # POST /matches or /matches.json
  def create
    @match = Match.new(match_params)

    respond_to do |format|
      if @match.save
        format.html { redirect_to @match, notice: "Match was successfully created." }
        format.json { render :show, status: :created, location: @match }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @match.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /matches/1 or /matches/1.json
  def update
    respond_to do |format|
      if @match.update(match_params)
        format.html { redirect_to @match, notice: "Match was successfully updated." }
        format.json { render :show, status: :ok, location: @match }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @match.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /matches/1 or /matches/1.json
  def destroy
    @match = Match.find(params[:id])
    respond_to do |format|
      if @match
        if @match.destroy
          format.json { head :no_content, status: :ok}
        end
      else
        format.json { render json: @match.errors, status: :unprocessable_entity }
      end
  	end
  end

  def create_random_match
    existing_match = Match.where(player2_id: nil).first
    if existing_match
      if existing_match.player1_id != current_user.id
        existing_match.player2_id = current_user.id
        existing_match.guild_2_id = current_user.guild_id
        respond_to do |format|
          if existing_match.save
            format.html { existing_match }
            format.json { render json: existing_match}
          else
            format.html { render :new, status: :unprocessable_entity }
            format.json { render json: { error: 'There is no such a user' }, status: :unprocessable_entity }
          end
        end
      else
        respond_to do |format|
          format.html { existing_match }
          format.json { render json: existing_match}
        end
      end
    else
      new_match = Match.new(player1_id: current_user.id, guild_1_id: current_user.guild_id)
      respond_to do |format|
        if new_match.save
          format.html { new_match }
          format.json { render json: new_match}
        else
          format.html { render :new, status: :unprocessable_entity }
          format.json { render json: { error: 'There is no such a user' }, status: :unprocessable_entity }
        end
      end
    end
  end

  def random_matches
    @random_matches = Match.where(player2_id: nil).order("#{:id}")

    respond_to do |format|
      format.html { @random_matches }
      format.json { render json: @random_matches}
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_match
      @match = Match.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def match_params
      params.require(:match).permit(:id, :player1_id, :player2_id, :player1_score, :player2_score, :guild_1_id, :guild_2_id, :addons_id, :is_end, :is_inprogress, :is_player1_online, :is_player2_online, :created_at, :updated_at)
    end
end
