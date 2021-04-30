class WarsController < ApplicationController
  before_action :set_war, only: %i[ show edit update destroy ]
  skip_before_action :verify_authenticity_token

  # GET /wars or /wars.json
  def index
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

  def guild_wars
    id = params[:id]
    wars = War.where("CASE WHEN guild_1_id = #{id} OR guild_2_id = #{id} THEN TRUE ELSE FALSE END").order("#{:start} desc")#.where(is_accepted: true)
    render json: wars
  end

  # POST /wars or /wars.json
  def create
    guild_2 = Guild.where(name: params[:guild_2]).first

    unless guild_2
      return render json: { error: 'There is no such a guild' }, status: :unprocessable_entity
	  end

    unless current_user.guild_id
      return render json: { error: 'You are not in guild' }, status: :unprocessable_entity
    end

    if current_user.guild_id == guild_2.id
      return render json: { error: 'You can not create match between the same guilds' }, status: :unprocessable_entity
    end

    date_start = Date.parse params[:date_start]
    time_start = Time.parse params[:time_start]
    war_start = DateTime.new(date_start.year, date_start.month, date_start.day, time_start.hour, time_start.min) - 3.hour

    date_end = Date.parse params[:date_end]
    time_end = Time.parse params[:time_end]
    war_end = DateTime.new(date_end.year, date_end.month, date_end.day, time_end.hour, time_end.min) - 3.hour

    if war_end - war_start < 0 || war_start - DateTime.now < 0 || war_end - DateTime.now < 0
      return render json: { error: 'Dates are invalid' }, status: :unprocessable_entity
    end

    @war = War.new(guild_1: current_user.guild, guild_2: guild_2, start: war_start, end: war_end, prize: params[:prize])
    
    if @war.save
      DeleteWarJob.set(wait_until: @war.start).perform_later(@war)
      NotificationJob.perform_later({
        user: @war.guild_2.owner,
        message: "The #{@war.guild_1.name} guild has declared war on you",
        link: "/wars/"
      })

      render json: @war, status: :created
    else
      render json: @war.errors, status: :unprocessable_entity
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

  def decline
    @war = War.find(params[:id])
    guild = @war.guild_2

    if current_user.id == guild.owner_id || (current_user.guild == guild && current_user.is_officer == true)
      @war.destroy()

      NotificationJob.perform_later({
            user: @war.guild_1.owner,
            message: "#{@war.guild_2.name} declined guid war",
            link: ""
      })
      # respond_to do |format|
      #   format.json { render :show, status: :ok, location: @war }
      # end
    #   render json: 1
	  respond_to do |format|
		if @war.destroy()
        	format.json { render json: 1, status: :ok, location: @war }
		else
			format.json { render json: { error: 'Unexpected error' }, status: :unprocessable_entity}
		end
      end
    else
      respond_to do |format|
        format.json { render json: { error: 'You have no rights' }, status: :unprocessable_entity}
      end
    end
  end

  def accept
    @war = War.where(id: params[:id]).first
    
    if @war.nil? || @war.start < DateTime.now
      return render json: { error: 'You are late to accept the war' }, status: :unprocessable_entity
    end
    
    guild1 = @war.guild_1
    guild2 = @war.guild_2

    if current_user.id == guild2.owner_id || (current_user.guild == guild2 && current_user.is_officer == true)
     
      all_wars = War.where(guild_1: guild1, is_accepted: true)
                .or(War.where(guild_2: guild1, is_accepted: true))
                .or(War.where(guild_1: guild2, is_accepted: true))
                .or(War.where(guild_2: guild2, is_accepted: true))

      same_time_wars = all_wars.where(start: @war.start..@war.end)    # Начало текущей войны находится во время другой принятой войны
                      .or(all_wars.where(end: @war.start..@war.end))  # Конец текущей войны находится во время другой принятой войны
                      .or(all_wars.where(start: DateTime.new(2021,1,1,0,0)..@war.start, end: @war.end..DateTime::Infinity.new)) # Начало раньше, конец позже другой принятой войны
      
      if same_time_wars.empty?
        @war.update(is_accepted: true)

        WarUpdateJob.set(wait_until: @war.start).perform_later(@war, "start")
        WarUpdateJob.set(wait_until: @war.end).perform_later(@war, "end")

        NotificationJob.perform_later({
          user: @war.guild_1.owner,
          message: "#{@war.guild_2.name} accepted guid war",
          link: "/wars/#{@war.id}"
        })

        render json: { id: @war.id }, status: :ok
      else
        render json: { error: 'Your guild or your opponent\'s guild is in another war at this time' }, status: :unprocessable_entity
      end
    else
      render json: { error: 'You are have no rights' }, status: :unprocessable_entity
    end
  end

  def create_war_match
    @war = War.where(id: params[:id]).first

############ Проверки
    if @war.nil?
      return render json: { error: 'War doesn\'t exist' }, status: :unprocessable_entity
# Война не принята или принята, но не началась
    elsif @war.is_accepted == false || (@war.is_inprogress == false && @war.is_end == false)
      return render json: { error: 'The war has not started yet' }, status: :unprocessable_entity
# Война закончилась
    elsif @war.is_end == true
      return render json: { error: 'The war is already end' }, status: :unprocessable_entity
# Пользователь не находится в гильдии, которая участвует в войне
    elsif current_user.guild.nil? || !(current_user.guild == @war.guild_1 || current_user.guild == @war.guild_2)
      return render json: { error: 'Your guild isn\'t participating in this war' }, status: :unprocessable_entity
    end
#
    war_matches = WarMatch.where(war_id: params[:id])
# Есть другие матчи войны в данный момент
    war_matches.each do |wm|
      if wm.match.is_inprogress == true || (wm.match.is_inprogress == false && wm.match.is_end == false)
        return render json: { error: 'There is already another match in your war' }, status: :unprocessable_entity
      end
    end #do loop
    ############

    guild_2_id = (current_user.guild.id == @war.guild_1.id) ? @war.guild_2.id : @war.guild_1.id
    @match = Match.new(player1_id: current_user.id, guild_1_id: current_user.guild_id, guild_2_id: guild_2_id, is_ranked: true)
    if @match.save
      @match.addons.update(addon3: true)
      
      WarMatch.create(war_id: @war.id, match_id: @match.id)
      UnansweredWarMatchJob.set(wait: 5.minutes).perform_later(@match, @war)
      return render json: @match
    else
      return render json: { error: 'Failed to create match' }, status: :unprocessable_entity
    end
    
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_war
      @war = War.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def war_params
      params.require(:@war).permit(:guild_1_id, :guild_2_id, :start, :end, :prize, :max_unanswered, :addons_id, :guild_1_wins, :guild_2_wins)
    end
end
