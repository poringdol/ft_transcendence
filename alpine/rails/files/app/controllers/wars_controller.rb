class WarsController < ApplicationController
  before_action :set_war, only: %i[ show edit update destroy ]

  # GET /wars or /wars.json
  def index
    @wars = War.all
  end

  # GET /wars/1 or /wars/1.json
  def show
  end

  # GET /wars/new
  def new
    @war = War.new
  end

  # GET /wars/1/edit
  def edit
  end

  # POST /wars or /wars.json
  def create
    @war = War.new(war_params)

    respond_to do |format|
      if @war.save
        format.html { redirect_to @war, notice: "War was successfully created." }
        format.json { render :show, status: :created, location: @war }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @war.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /wars/1 or /wars/1.json
  def update
    respond_to do |format|
      if @war.update(war_params)
        format.html { redirect_to @war, notice: "War was successfully updated." }
        format.json { render :show, status: :ok, location: @war }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @war.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /wars/1 or /wars/1.json
  def destroy
    @war.destroy
    respond_to do |format|
      format.html { redirect_to wars_url, notice: "War was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_war
      @war = War.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def war_params
      params.require(:war).permit(:guild_1_id, :guild_2_id, :start, :end, :prize, :max_unanswered, :addons_id, :guild_1_wins, :guild_2_wins)
    end
end
