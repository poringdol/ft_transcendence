class WarMatchesController < ApplicationController
  before_action :set_war_match, only: %i[ show edit update destroy ]

  # GET /war_matches or /war_matches.json
  def index
    @war_matches = WarMatch.all
  end

  # GET /war_matches/1 or /war_matches/1.json
  def show
  end

  # GET /war_matches/new
  def new
    @war_match = WarMatch.new
  end

  # GET /war_matches/1/edit
  def edit
  end

  # POST /war_matches or /war_matches.json
  def create
    @war_match = WarMatch.new(war_match_params)

    respond_to do |format|
      if @war_match.save
        format.html { redirect_to @war_match, notice: "War match was successfully created." }
        format.json { render :show, status: :created, location: @war_match }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @war_match.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /war_matches/1 or /war_matches/1.json
  def update
    respond_to do |format|
      if @war_match.update(war_match_params)
        format.html { redirect_to @war_match, notice: "War match was successfully updated." }
        format.json { render :show, status: :ok, location: @war_match }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @war_match.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /war_matches/1 or /war_matches/1.json
  def destroy
    @war_match.destroy
    respond_to do |format|
      format.html { redirect_to war_matches_url, notice: "War match was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_war_match
      @war_match = WarMatch.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def war_match_params
      params.require(:war_match).permit(:match_id, :war_id)
    end
end
