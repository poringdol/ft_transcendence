class TournamentUsersController < ApplicationController
  before_action :set_tournament_user, only: %i[ show edit update destroy ]

  # GET /tournament_users or /tournament_users.json
  def index
    @tournament_users = TournamentUser.all
  end

  # GET /tournament_users/1 or /tournament_users/1.json
  def show
  end

  # GET /tournament_users/new
  def new
    @tournament_user = TournamentUser.new
  end

  # GET /tournament_users/1/edit
  def edit
  end

  # POST /tournament_users or /tournament_users.json
  def create
    @tournament_user = TournamentUser.new(tournament_user_params)

    respond_to do |format|
      if @tournament_user.save
        format.html { redirect_to @tournament_user, notice: "Tournament user was successfully created." }
        format.json { render :show, status: :created, location: @tournament_user }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @tournament_user.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /tournament_users/1 or /tournament_users/1.json
  def update
    respond_to do |format|
      if @tournament_user.update(tournament_user_params)
        format.html { redirect_to @tournament_user, notice: "Tournament user was successfully updated." }
        format.json { render :show, status: :ok, location: @tournament_user }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @tournament_user.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /tournament_users/1 or /tournament_users/1.json
  def destroy
    @tournament_user.destroy
    respond_to do |format|
      format.html { redirect_to tournament_users_url, notice: "Tournament user was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_tournament_user
      @tournament_user = TournamentUser.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def tournament_user_params
      params.require(:tournament_user).permit(:user_id, :tournament_id)
    end
end
