class GuildsController < ApplicationController
  before_action :check_nickname, only: [:add_officer]
  before_action :check_guild, only: [:join, :exit, :add_officer, :delete_officer, :delete_member]

  def index
    @guilds = Guild.all
  end

  def get_guilds
    @guilds = Guild.all
  end

  def new
    @guild = Guild.new
  end

  def create
    @guild = Guild.new(name: params[:guild][:name], anagram: params[:guild][:anagram], score: 0, owner_id: current_user.id)
    respond_to do |format|
      unless @guild.save
        format.html { redirect_to '/guilds/new', notice: @guild.errors.full_messages.join("; ") }
      else
        format.html { redirect_to '/guilds', notice: 'Kaef\'' }
        member = GuildMember.new(user_id: current_user.id, guild_id: @guild.id)
        member.save
        current_user.guild_id = @guild.id
        current_user.save
      end
    end
  end

  def show
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
      redirect_and_responce("Success")
    end
  end

  def exit
    unless current_user.guild_id?
      redirect_and_responce("You not in guild")
    else
      member = GuildMember.all.find_by(user_id: current_user.id)
      if member
        member.delete
      end
      guild = Guild.all.find(current_user.guild_id)
      unless GuildMember.all.find_by(guild_id: guild.id)
        guild.destroy
      end 
      current_user.guild_id = 0
      current_user.save
      redirect_and_responce("Success")
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
      member.user.guild_id = 0
      member.user.save
      member.delete
      redirect_and_responce("Success")
    end
  end

  private
    def guilds_params
      params.require(:guild).permit(:name, :anagram)
    end

    def check_nickname
      redirect_to guilds_path, notice: "Empty field" and return if params[:nickname] == ""
    end

    def redirect_and_responce(responce)
      respond_to do |f|
        f.html { redirect_to '/guilds', notice: responce }
      end
    end

    def check_guild
      redirect_to guilds_path, notice: "Guild not found" and return if !Guild.all.find(params[:id])
    end

end
