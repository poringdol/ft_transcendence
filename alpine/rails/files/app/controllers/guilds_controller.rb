class GuildsController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :check_nickname, only: [:add_officer]
  before_action :set_guild, only: [:destroy]
  before_action :check_guild, only: [:join, :exit, :add_officer, :delete_officer, :delete_member]


  def index

    @guilds = Guild.all

    respond_to do |format|
      format.html { @guilds }
      format.json { render json: @guilds }
    end
  end


  def otladka
    @guild_ms = GuildMember.all

    for guild_m in @guild_ms
      guild_m.destroy
    end
    
    @guilds = Guild.all
    for guild in @guilds
      guild.destroy
    end
    
    @users = User.all
    for user in @users
      user.guild_id = 0
      user.save
    end

    respond_to do |format|
      format.json { render json: @users }
    end
  end


  def get_owner_nickname
    owner = User.all.find(params[:owner_id])
    render json: owner
  end


  def get_curr_user
    render json: current_user
  end


  def get_guilds
    @guilds = Guild.all
	  render json: @guilds
  end


  def destroy
    @guild.destroy
    current_user.guild_id = 0
    current_user.save
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
        # format.html { redirect_to '/guilds', notice: @guild.errors.full_messages.join("; ") }
        format.html { render json: @guild.errors.full_messages.join("; "), status: :unprocessable_entity}
        # format.json { render json: @guild.errors, status: :unprocessable_entity }
        # render json: @guild.errors, status: :unprocessable_entity
      else
        format.html { render json: @guild, status: :created, location: @guild}
        member = GuildMember.new(user_id: current_user.id, guild_id: @guild.id)
        member.save

        current_user.guild_id = @guild.id
        current_user.save
		    # render json: @guild
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
	  render json: 0
    end
  end


  def exit

    unless current_user.guild_id?
      redirect_and_responce("You not in guild")
    else
      member = GuildMember.all.find_by(user_id: current_user.id)
      if member
        member.destroy
      end

      guild = Guild.all.find(current_user.guild_id)
	    guild_members = GuildMember.all.find_by(guild_id: guild.id)

      unless guild_members
        guild.destroy
	    else
        if current_user.id == guild.owner_id
          guild.owner_id = guild_members.user_id
          guild.save
        end
      end 

      current_user.guild_id = 0
      current_user.save
      render json: 0
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

  	def set_guild
      @guild = Guild.find(params[:id])
    end


    def guilds_params
      params.require(:guild).permit(:name, :anagram)
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
