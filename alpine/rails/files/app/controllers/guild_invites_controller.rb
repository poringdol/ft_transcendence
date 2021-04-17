class GuildInvitesController < ApplicationController
  before_action :set_guild_invite, only: %i[ show edit update destroy ]

  # GET /guild_invites or /guild_invites.json
  def index
    @guild_invites = GuildInvite.all
  end

  # GET /guild_invites/1 or /guild_invites/1.json
  def show
  end

  # GET /guild_invites/new
  def new
    @guild_invite = GuildInvite.new
  end

  # GET /guild_invites/1/edit
  def edit
  end

  # POST /guild_invites or /guild_invites.json
  def create
    @guild_invite = GuildInvite.new(guild_invite_params)

    respond_to do |format|
      if @guild_invite.save
        format.html { redirect_to @guild_invite, notice: "Guild invite was successfully created." }
        format.json { render :show, status: :created, location: @guild_invite }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @guild_invite.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /guild_invites/1 or /guild_invites/1.json
  def update
    respond_to do |format|
      if @guild_invite.update(guild_invite_params)
        format.html { redirect_to @guild_invite, notice: "Guild invite was successfully updated." }
        format.json { render :show, status: :ok, location: @guild_invite }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @guild_invite.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /guild_invites/1 or /guild_invites/1.json
  def destroy
    @guild_invite.destroy
    respond_to do |format|
      format.html { redirect_to guild_invites_url, notice: "Guild invite was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_guild_invite
      @guild_invite = GuildInvite.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def guild_invite_params
      params.fetch(:guild_invite, {})
    end
end
