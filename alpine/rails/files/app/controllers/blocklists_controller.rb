class BlocklistsController < ApplicationController
  before_action :set_blocklist, only: %i[ show edit update destroy ]

  # GET /blocklists or /blocklists.json
  def index
    @blocklists = Blocklist.all
  end

  # GET /blocklists/1 or /blocklists/1.json
  def show
  end

  # GET /blocklists/new
  def new
    @blocklist = Blocklist.new
  end

  # GET /blocklists/1/edit
  def edit
  end

  # POST /blocklists or /blocklists.json
  def create
    @blocklist = Blocklist.new(blocklist_params)

    respond_to do |format|
      if @blocklist.save
        format.html { redirect_to @blocklist, notice: "Blocklist was successfully created." }
        format.json { render :show, status: :created, location: @blocklist }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @blocklist.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /blocklists/1 or /blocklists/1.json
  def update
    respond_to do |format|
      if @blocklist.update(blocklist_params)
        format.html { redirect_to @blocklist, notice: "Blocklist was successfully updated." }
        format.json { render :show, status: :ok, location: @blocklist }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @blocklist.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /blocklists/1 or /blocklists/1.json
  def destroy
    @blocklist.destroy
    respond_to do |format|
      format.html { redirect_to blocklists_url, notice: "Blocklist was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  def unblock_user
	@blocklist = Blocklist.find(params[:id])
	if @blocklist.user_id == current_user.id
		if @blocklist.destroy
			render json: 1
		end
	end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_blocklist
      @blocklist = Blocklist.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def blocklist_params
      params.require(:blocklist).permit(:user_id, :blocked_user_id)
    end
end
