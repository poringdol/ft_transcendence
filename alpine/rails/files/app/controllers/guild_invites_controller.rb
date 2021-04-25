class GuildInvitesController < ApplicationController
#   before_action :set_guild_invite, only: %i[ show edit update destroy ]

  # GET /guild_invites or /guild_invites.json
  def index
    @guild_invites = GuildInvite.all
	  render json: @guild_invites
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
  
  def del_all_invites
    @guild_invites = GuildInvite.all
    for invite in @guild_invites
      invite.destroy
    end
  end

  def users_invites
    @guild_invites = GuildInvite.where(invited_id: params[:id])
    render json: @guild_invites
  end

  def accept_invitation
    @guild_invite	= GuildInvite.find(params[:id])
    guild			= Guild.find(@guild_invite.guild_id)

    if (@guild_invite && guild && @guild_invite.invited_id == current_user.id)
      current_user.guild_id = @guild_invite.guild_id
      if (current_user.save && @guild_invite.destroy)
        render json: current_user.guild_id, status: :created, location: @guild_invite
      else
        render json: 0, status: :unprocessable_entity
      end
    else
      render json: 0, status: :unprocessable_entity
    end
  end

  def decline_invitation
    @guild_invite	= GuildInvite.find(params[:id])

    if (@guild_invite && @guild_invite.invited_id == current_user.id)
      if (@guild_invite.destroy)
        render json: current_user.guild_id, status: :created, location: @guild_invite
      else
        render json: 0, status: :unprocessable_entity
      end
    else
      render json: 0, status: :unprocessable_entity
    end
  end

  def invite_to_guild
    inviter_id	= current_user.id
    invited		= User.find(params[:id])
    guild		= Guild.find(current_user.guild_id)

    guild_invite_cur = GuildInvite.find_by(inviter_id: inviter_id, invited_id: invited.id, guild_id: guild.id)
    if (guild_invite_cur)
      render json: guild_invite_cur, status: :created, location: @guild_invite
    elsif (guild && invited && (invited.id != inviter_id))
      @guild_invite = GuildInvite.new(inviter_id: inviter_id, invited_id: invited.id, guild_id: guild.id)
      if @guild_invite.save
        render json: @guild_invite, status: :created, location: @guild_invite
      else
        render json: @guild_invite.errors, status: :unprocessable_entity
      end
    else
      render json: 0, status: :unprocessable_entity
    end
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
