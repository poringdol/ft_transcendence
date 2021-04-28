class MatchesController < ApplicationController
  before_action :set_match, only: %i[ show edit update match_users_update ]

  skip_before_action :verify_authenticity_token

  # GET /matches or /matches.json
  def index
    @matches = Match.where("player2_id IS NOT NULL").order("#{:id} desc")

    respond_to do |format|
      format.html { @matches }
      format.json { render json: @matches}
    end
  end

  def users_matches
    id = params[:id]
    @matches = Match.where("CASE WHEN player1_id = #{id} OR player2_id = #{id} THEN TRUE ELSE FALSE END").order("#{:id} desc")
    respond_to do |format|
      format.html { @matches }
      format.json { render json: @matches}
    end
  end

  # получить матч и игроков
  def match_users
    @match = Match.find(params[:id])
    @match.current_user = current_user
    @match.save
    render json: @match
  end

  def get_player
    player = User.find(params[:id])
    render json: player
  end

  # обновление модели
  def match_users_update
    respond_to do |format|
      if @match.update(match_params)
        format.html { redirect_to @match, notice: "War was successfully updated." }
        format.json { render json: @match}
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @match.errors, status: :unprocessable_entity }
      end
    end
  end

  # GET /matches/1 or /matches/1.json
  def show
  end

  # GET /matches/new
  def new
    @match = Match.new
  end

  # GET /matches/1/edit
  def edit
  end

  def new_match

    player2 = User.find_by(nickname: params[:player2])
    if (player2 && player2 != current_user)
      player1_id = current_user.id
      player2_id = player2.id
      guild_1_id = current_user.guild_id
      guild_2_id = player2.guild_id

      @match = Match.new(player1_id: player1_id, player2_id: player2_id, guild_1_id: guild_1_id, guild_2_id: guild_2_id)
      respond_to do |format|
        if @match.save

          if (params[:color] == "disco")
            @match.addons.addon1 = true
          elsif (params[:color] == "epilepsy")
            @match.addons.addon2 = true
          end
          if (params[:boost] == "boost")
            @match.addons.addon3 = true
          end
          @match.addons.save

          NotificationJob.perform_later({
            user: player2,
            message: "#{@match.player1.nickname} invite you to play a game",
            link: "/matches/#{@match.id}"
          })

          format.html { redirect_to @match, notice: "Match was successfully created." }
          format.json { render :show, status: :created, location: @match }

        else
          format.html { render :new, status: :unprocessable_entity }
          format.json { render json: @match.errors, status: :unprocessable_entity }
        end
      end
    elsif (player2 == current_user)
      respond_to do |format|
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: { error: 'You cannot play with yourself ' }, status: :unprocessable_entity, errorText: "sss" }
      end
    else
      respond_to do |format|
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: { error: 'There is no such a user' }, status: :unprocessable_entity, errorText: "sss" }
      end
    end
  end

  def new_match_profile

    player2 = User.find_by(id: params[:id])

    if (player2)
      player1_id = current_user.id
      player2_id = player2.id
      guild_1_id = current_user.guild_id
      guild_2_id = player2.guild_id

      @match = Match.new(player1_id: player1_id, player2_id: player2_id, guild_1_id: guild_1_id, guild_2_id: guild_2_id)
      respond_to do |format|
        if @match.save
          NotificationJob.perform_later({
            user: player2,
            message: "You will be invited to game with #{current_user.nickname}. Go to game!",
            link: "/matches/#{@match.id}"
          })
          format.html { redirect_to @match, notice: "Match was successfully created." }
          format.json { render json: @match}

        else
          format.html { render :new, status: :unprocessable_entity }
          format.json { render json: @match.errors, status: :unprocessable_entity }
        end

      end
    else
      respond_to do |format|
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: { error: 'There is no such a user' }, status: :unprocessable_entity, errorText: "sss" }
      end
    end
  end

  # POST /matches or /matches.json
  def create
    @match = Match.new(match_params)

    respond_to do |format|
      if @match.save
        format.html { redirect_to @match, notice: "Match was successfully created." }
        format.json { render :show, status: :created, location: @match }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @match.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /matches/1 or /matches/1.json
  def update
    respond_to do |format|
      if @match.update(match_params)
        format.html { redirect_to @match, notice: "Match was successfully updated." }
        format.json { render :show, status: :ok, location: @match }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @match.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /matches/1 or /matches/1.json
  def destroy
    @match = Match.find(params[:id])
    respond_to do |format|
      if @match
        if @match.destroy
          format.json { head :no_content, status: :ok}
        end
      else
        format.json { render json: @match.errors, status: :unprocessable_entity }
      end
  	end
  end

  def create_random_match

    existing_match = Match.where(player2_id: nil).first
    
    if existing_match
    
      if existing_match.player1_id != current_user.id
        
        existing_match.player2_id = current_user.id
        existing_match.guild_2_id = current_user.guild_id
        
        respond_to do |format|
          if existing_match.save
            format.html { existing_match }
            format.json { render json: existing_match}
          else
            format.html { render :new, status: :unprocessable_entity }
            format.json { render json: { error: 'There is no such a user' }, status: :unprocessable_entity }
          end
        end

      else
        respond_to do |format|
          format.html { existing_match }
          format.json { render json: existing_match}
        end
      end

    else
      new_match = Match.new(player1_id: current_user.id, guild_1_id: current_user.guild_id, is_ranked: true)
      respond_to do |format|
        if new_match.save
          format.html { new_match }
          format.json { render json: new_match}
        else
          format.html { render :new, status: :unprocessable_entity }
          format.json { render json: { error: 'There is no such a user' }, status: :unprocessable_entity }
        end
      end

    end
  end

  def random_matches
    @random_matches = Match.where(player2_id: nil).order("#{:id}")

    respond_to do |format|
      format.html { @random_matches }
      format.json { render json: @random_matches}
    end
  end

  def end_game
    match = Match.find(params[:id])
    # update_war_status()
    if match.is_ranked?
      war_score(match.guild_1, match.guild_2, match.player1_score, match.player2_score)
      set_rating(match)
    end

    match.update(is_end: true, is_inprogress: false)
  end

  def watch_stream
    user = User.find(params[:streamer_id])
    match = Match.where(player1: user, is_inprogress: true, is_player1_online: true)
                   .or(Match.where(player2: user, is_inprogress: true, is_player2_online: true))

    if match.empty?
      redirect_to "/matches"
    else
      redirect_to "/matches/#{match.first.id}"
    end
  end

  def duration
    p "33333333333333333333333333"
    p "33333333333333333333333333"
    p "33333333333333333333333333"
    p "33333333333333333333333333"
    p "33333333333333333333333333"
    p "33333333333333333333333333"
    p "33333333333333333333333333"
    p "33333333333333333333333333"
    p "33333333333333333333333333"
    p "33333333333333333333333333"
    p "33333333333333333333333333"
    p params
    p "44444444444444444444444444"
    p "44444444444444444444444444"
    p "44444444444444444444444444"
    p "44444444444444444444444444"
    p "44444444444444444444444444"
    p "44444444444444444444444444"
    p "44444444444444444444444444"
    p "44444444444444444444444444"
    p "44444444444444444444444444"
    p "44444444444444444444444444"
    p "44444444444444444444444444"
    p "44444444444444444444444444"
    # end_game(params[:id])
  end
  handle_asynchronously :duration, :run_at => Proc.new { 1.minutes.from_now }

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_match
      @match = Match.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def match_params
      params.require(:match).permit(:id, :player1_id, :player2_id, :player1_score, :player2_score, :guild_1_id, :guild_2_id, :addons_id, :is_end, :is_inprogress, :is_player1_online, :is_player2_online, :rating, :is_ranked, :created_at, :updated_at)
    end

    def set_rating(match)
      winner = (match.player1_score - match.player2_score > 0) ? match.player1 : match.player2
      loser  = (winner == match.player1) ? match.player2 : match.player1
      
      rating = (match.player1_score - match.player2_score).abs
      match.rating = (rating <= loser.score) ? rating : loser.score
      match.save()
      
      if match.rating != 0
        winner.update(score: (winner.score + match.rating))
        loser.update(score: (loser.score - match.rating))

        unless winner.guild.nil?
          winner.guild.update(score: (winner.guild.score + match.rating))
        end
      end
    end

    def update_war_status
      wars_ended = War.where(start: DateTime.now..DateTime::Infinity.new, is_accepted: true)
               .or(War.where(end: DateTime.new(2021,1,1,0,0)..DateTime.now))
      wars_ended.each do |it|
        it.guild_1.update(is_in_war: false)
        it.guild_2.update(is_in_war: false)
      end
      
      wars_now = War.where(start: DateTime.new(2021,1,1,0,0)..DateTime.now, end: DateTime.now..DateTime::Infinity.new, is_accepted: true)
      wars_now.each do |it|
        it.guild_1.update(is_in_war: true)
        it.guild_2.update(is_in_war: true)
      end
    end

    def war_score(guild_1, guild_2, score_1, score_2)
      unless guild_1.nil? && guild_2.nil?
        if guild_1.is_in_war?
          war = War.where(guild_1: guild_1, is_accepted: true)
                   .or(War.where(guild_2: guild_1, is_accepted: true))
                   .where(start: DateTime.new(2021,1,1,0,0)..DateTime.now, end: DateTime.now..DateTime::Infinity.new)
          unless war.empty?
            if war.first.guild_1 == guild_2 || war.first.guild_2 == guild_2
              if score_1 > score_2
                war.first.update(guild_1_wins: (war.first.guild_1_wins + 1))
              else
                war.first.update(guild_2_wins: (war.first.guild_2_wins + 1))
              end
            end
          end
        end
      end
    end
end

