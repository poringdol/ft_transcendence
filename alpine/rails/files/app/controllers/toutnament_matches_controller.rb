class TournamentMatchesController < ApplicationController
  before_action :set_tournament_match, only: %i[ show edit update destroy ]

  # GET /tournament_matches or /tournament_matches.json
  def index
    @tournament_matches = TournamentMatch.all
  end

  # GET /tournament_matches/1 or /tournament_matches/1.json
  def show
  end

  # GET /tournament_matches/new
  def new
    @tournament_match = TournamentMatch.new
  end

  # GET /tournament_matches/1/edit
  def edit
  end

  # POST /tournament_matches or /tournament_matches.json
  def create
    @tournament_match = TournamentMatch.new(tournament_match_params)

    respond_to do |format|
      if @tournament_match.save
        format.html { redirect_to @tournament_match, notice: "Tournament match was successfully created." }
        format.json { render :show, status: :created, location: @tournament_match }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @tournament_match.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /tournament_matches/1 or /tournament_matches/1.json
  def update
    respond_to do |format|
      if @tournament_match.update(tournament_match_params)
        format.html { redirect_to @tournament_match, notice: "Tournament match was successfully updated." }
        format.json { render :show, status: :ok, location: @tournament_match }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @tournament_match.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /tournament_matches/1 or /tournament_matches/1.json
  def destroy
    @tournament_match.destroy
    respond_to do |format|
      format.html { redirect_to tournament_matches_url, notice: "Tournament match was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_tournament_match
      @tournament_match = TournamentMatch.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def tournament_match_params
      params.require(:tournament_match).permit(:tournament_id, :match_id)
    end
end
