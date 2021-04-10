class MatchesController < ApplicationController
  before_action :set_match, only: %i[ show edit update destroy match_users_update ]

  skip_before_action :verify_authenticity_token

  # GET /matches or /matches.json
  def index
    @matches = Match.all
  end

  # получить матч и игроков
  def match_users
    @match = Match.find(params[:id])
    @match.current_user = current_user
    @match.save
    render json: @match
  end

  # обновление модели
  def match_users_update
    respond_to do |format|
      if @match.update(match_params)
        format.html { redirect_to @match, notice: "War was successfully updated." }
        format.json { render :show, status: :ok, location: @match }
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
    @match.destroy
    respond_to do |format|
      format.html { redirect_to matches_url, notice: "Match was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_match
      @match = Match.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def match_params
      params.require(:match).permit(:id, :player1_id, :player2_id, :player1_score, :player2_score, :guild_1_id, :guild_2_id, :addons_id, :is_end, :is_inprogress, :is_player1_online, :is_player2_online, :is_player1_ready, :is_player2_ready, :created_at, :updated_at)
    end
end
