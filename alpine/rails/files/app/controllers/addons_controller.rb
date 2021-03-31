class AddonsController < ApplicationController
  before_action :set_addon, only: %i[ show edit update destroy ]

  # GET /addons or /addons.json
  def index
    @addons = Addon.all
  end

  # GET /addons/1 or /addons/1.json
  def show
  end

  # GET /addons/new
  def new
    @addon = Addon.new
  end

  # GET /addons/1/edit
  def edit
  end

  # POST /addons or /addons.json
  def create
    @addon = Addon.new(addon_params)

    respond_to do |format|
      if @addon.save
        format.html { redirect_to @addon, notice: "Addon was successfully created." }
        format.json { render :show, status: :created, location: @addon }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @addon.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /addons/1 or /addons/1.json
  def update
    respond_to do |format|
      if @addon.update(addon_params)
        format.html { redirect_to @addon, notice: "Addon was successfully updated." }
        format.json { render :show, status: :ok, location: @addon }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @addon.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /addons/1 or /addons/1.json
  def destroy
    @addon.destroy
    respond_to do |format|
      format.html { redirect_to addons_url, notice: "Addon was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_addon
      @addon = Addon.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def addon_params
      params.require(:addon).permit(:addon1, :addon2, :addon3)
    end
end
