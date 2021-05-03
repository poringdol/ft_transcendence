class GuildsController < ApplicationController
  skip_before_action :verify_authenticity_token
  # skip_forgery_protection

  before_action :check_nickname, only: [:add_officer]
  before_action :set_guild, only: [:destroy, :update]
  before_action :check_guild, only: [:join, :add_officer, :delete_officer, :delete_member]


  def index
    @guilds = Guild.order(:score).reverse

    respond_to do |format|
      format.html { @guilds }
      format.json { render json: @guilds }
    end
  end

  def guilds_list
  guilds_names = Guild.all.select(:name).order(:name)
  render json: guilds_names
  end

  def get_owner_nick
    guild = Guild.find(params[:id])
    owner = User.find(guild.owner_id)
    render json: owner
  end


  def get_curr_user
    render json: current_user, serializer: GuildUserSerializer
  end


  def get_guild
    guild = Guild.find(params[:id])
    render json: guild
  end

  def get_guild_users
    guild_users = User.all.where(guild_id: params[:id])
    render json: guild_users, each_serializer: GuildUserSerializer
  end

  def user_update
    User.find(params[:id])
  end

  def get_guilds
    @guilds = Guild.all
    render json: @guilds
  end


  def destroy
    @guild.destroy
  end

  def is_owner
    user = User.find(params[:id])
    if (user && user.guild_id)
      guild = Guild.find(user.guild_id)
      if (guild)
        if (guild.owner_id == user.id)
          render json: 1, status: :created
        else
          render json: 0, status: :created
        end
      end
    end
  end

  def exit_user
    user = User.find(params[:id])

    unless user.guild_id?
      redirect_and_responce("User not in guild")
    else
      guild_id = user.guild_id
      user.guild_id = nil
      user.is_officer = false
      user.save
      guild = Guild.all.find(guild_id)
      guild_members = User.all.find_by(guild_id: guild_id)

      unless guild_members
        guild.destroy

      guild_invites = GuildInvite.where(guild_id: guild_id)
      for guild_invite in guild_invites
        guild_invite.destroy
      end

      else
        if user.id == guild.owner_id
          guild.owner_id = guild_members.id
          guild.save
        end
      end

      if guild_members
        new_owner = User.all.find(guild.owner_id)
        render json: new_owner
      else
        render json: 0
      end
    end
  end

  def do_officer
    user = User.find(params[:id])
    user.is_officer = true
    if user.save
      render json: 1
    end
  end

  def undo_officer
    user = User.find(params[:id])
    user.is_officer = false
    if user.save
      render json: 1
    end
  end


  def do_owner
    user = User.find(params[:id])
    unless user.guild_id?
      redirect_and_responce("User not in guild")
    else
      guild = Guild.find(user.guild_id)
      if guild.owner_id == current_user.id || current_user.is_admin == true || current_user.is_moderator == true
        guild.owner_id = user.id
        if guild.save
            render json: {}, status: :ok
        end
      end
    end
  end

  def new
    @guild = Guild.new
  end


  def create_new_guild
    @guild = Guild.new(name: params[:name], anagram: params[:anagram], score: 0, owner_id: current_user.id)
    if @guild.save
      render json: @guild, status: :created, location: @guild
    else
      render json: @guild.errors, status: :unprocessable_entity
    end
  end


  def create

    @guild = Guild.new(name: params[:guild][:name], anagram: params[:guild][:anagram], score: 0, owner_id: current_user.id)

    respond_to do |format|
      unless @guild.save
        format.html { render json: @guild.errors.full_messages.join("; "), status: :unprocessable_entity}
      else
        format.html { render json: @guild, status: :created, location: @guild}
        current_user.save
      end
    end
  end


  def show
  end

  def update
    @guild.update(guilds_params)
  end

  def join
    if current_user.guild_id?
      redirect_and_responce("You allready in guild")
    else
      guild = Guild.all.find(params[:id])
      member = GuildMember.new(user_id: current_user.id, guild_id: guild.id)
      member.save
      current_user.guild_id = guild.id
      current_user.save
      render json: 0
    end
  end


  def exit
    unless current_user.guild_id?
      redirect_and_responce("You not in guild")
    else
      guild_id = current_user.guild_id
      current_user.guild_id = nil
      current_user.is_officer = false
      current_user.save
      guild = Guild.all.find(guild_id)
      guild_members = User.all.find_by(guild_id: guild_id)

      unless guild_members
        guild.destroy

        guild_invites = GuildInvite.where(guild_id: guild_id)
        for guild_invite in guild_invites
          guild_invite.destroy
        end

      else
        if current_user.id == guild.owner_id
          guild.owner_id = guild_members.id
          guild.save
        end
      end

      if guild_members
        new_owner = User.all.find(guild.owner_id)
        render json: new_owner
      else
        render json: 0
      end
    end
  end


  def add_officer

    guild = Guild.all.find(params[:id])
    user = all_users.find_by(nickname: params[:nickname])

    if current_user.guild_id == 0
      redirect_and_responce("You not in guild")
    elsif guild.owner_id != current_user.id
      redirect_and_responce("Sosat\' suka! You are not have rights")
    elsif user == nil
      redirect_and_responce("Sosat\' suka! User not in you guild")
    else
      member = guild.members
      officer = guild.officers

      if member && !member.find_by(id: user.id)
        redirect_and_responce("Not guild member")
      elsif officer && guild.officers.find_by(id: user.id)
        redirect_and_responce("Already officer")
      else
        officer = GuildOfficer.new(user_id: user.id, guild_id: guild.id)
        officer.save
        redirect_and_responce("Success")
      end
    end
  end


  def delete_officer

    guild = Guild.all.find(params[:id])
    officer = GuildOfficer.all.find_by(user_id: params[:officer_id])

    if guild.owner_id != current_user.id
      redirect_and_responce("You are not a owner")
    elsif !officer
      redirect_and_responce("Not officer")
    else
      officer.delete
      redirect_and_responce("Success")
    end
  end


  def delete_member

    guild = Guild.all.find(params[:id])
    member = GuildMember.all.find_by(user_id: params[:member_id])
    officer = GuildOfficer.all.find_by(user_id: params[:member_id])

    if !member
      redirect_and_responce("User not in a guild")
    elsif member.user.id == current_user.id
      redirect_and_responce("You can't delete yourself")
    elsif guild.owner_id != current_user.id && (!guild.officers.find_by(id: current_user.id) || officer || guild.owner_id == member.user.id)
      redirect_and_responce("You not have rights")
    else
      if officer
        officer.delete
      end
      member.user.guild_id = nil
      member.user.save
      member.delete
      redirect_and_responce("Success")
    end
  end

  def update_name
    guild = Guild.all.find(params[:id])
    guild.name = params[:name]
    guild.save!
    redirect_to '/guilds'
  end

  def update_anagram
    guild = Guild.all.find(params[:id])
    guild.anagram = params[:anagram]
    redirect_to '/guilds'
    guild.save!
  end

  def update_logo
    guild = Guild.all.find(params[:id])
    File.open(params[:logo]) do |f|
      guild.logo = f
    end
    guild.save!
    redirect_to '/guilds'
  end

  private

    def set_guild
      @guild = Guild.find(params[:id])
    end


    def guilds_params
      params.require(:guild).permit(:name, :anagram, :logo)
    end


    def check_nickname
      redirect_to guilds_path, notice: "Empty field" and return if params[:nickname] == ""
    end


    def redirect_and_responce(responce)

      respond_to do |f|
        f.html { redirect_to '/guilds', notice: responce }
        f.json { render json: responce }
      end
    end


    def check_guild
      redirect_to guilds_path, notice: "Guild not found" and return if !Guild.all.find(params[:id])
    end

  end
