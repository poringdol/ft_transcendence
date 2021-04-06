class MatchesController < ApplicationController
  before_action :set_match, only: %i[ show edit update destroy ]
  skip_before_action :verify_authenticity_token, only: [:move_bracket]

  # GET /matches or /matches.json
  def index
    @matches = Match.all
  end

  def match_users
    @match = Match.find(params[:id])
    @match.current_user = current_user
    @match.save
    render json: @match
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

  def move_bracket
    # Принимаем параметры, посланные из pingpong.js пост запросом, передаем параметры в match_channel.js
    ActionCable.server.broadcast "match_channel_#{params[:id]}", { match_id: params[:id], key_code: params[:key_code], player: params[:player]}
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_match
      @match = Match.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def match_params
      params.require(:match).permit(:player1_id, :player2_id, :player1_score, :player2_score, :guild_1_id, :guild_2_id, :addons_id, :is_end)
    end
end
