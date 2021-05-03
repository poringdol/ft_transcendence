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
      guild1_id = current_user.guild_id
      guild2_id = player2.guild_id

      @match = Match.new(player1_id: player1_id, player2_id: player2_id, guild1_id: guild1_id, guild2_id: guild2_id)
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

          DeleteGameInviteJob.set(wait: 5.minutes).perform_later(@match)
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

  def war_matches
    @war_matches = Match.where(war_id: params[:id]).order(:id).reverse

    unless @war_matches.empty?
      render json: @war_matches
    end
  end

  def new_match_profile

    player2 = User.find_by(id: params[:id])

    if (player2)
      player1_id = current_user.id
      player2_id = player2.id
      guild1_id = current_user.guild_id
      guild2_id = player2.guild_id

      @match = Match.new(player1_id: player1_id, player2_id: player2_id, guild1_id: guild1_id, guild2_id: guild2_id)
      respond_to do |format|
        if @match.save

          DeleteGameInviteJob.set(wait: 5.minutes).perform_later(@match)
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
        existing_match.guild2_id = current_user.guild_id
        @match = existing_match

        respond_to do |format|
          if existing_match.save
            format.html { existing_match }
            format.json { render json: existing_match}
          else
            format.html { render :new, status: :unprocessable_entity }
            format.json { render json: { error: 'Error while creating a match' }, status: :unprocessable_entity }
          end
        end

      else
        respond_to do |format|
          format.html { existing_match }
          format.json { render json: existing_match}
        end
      end

    else
      new_match = Match.new(player1_id: current_user.id, guild1_id: current_user.guild_id, is_ranked: true)
      respond_to do |format|
        if new_match.save
          new_match.addons.update(addon3: true)

           DeleteGameInviteJob.set(wait: 5.minutes).perform_later(new_match)
          format.html { new_match }
          format.json { render json: new_match}
        else
          format.html { render :new, status: :unprocessable_entity }
          format.json { render json: { error: 'Error while creating a match' }, status: :unprocessable_entity }
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

    set_win_loses(match)
    war_score(match, match.guild1, match.guild2, match.addons)
    tournament_score(match)

    if match.is_ranked?
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

  private
    # Use callbacks to share common setup or constraints between actions.
  def set_match
    @match = Match.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def match_params
    params.require(:match).permit(:id, :player1_id, :player2_id, :player1_score, :player2_score, :guild1_id, :guild2_id, :addons_id, :is_end, :is_inprogress, :is_player1_online, :is_player2_online, :rating, :is_ranked, :created_at, :updated_at, :war, :current_user, :player1, :player2, :guild1, :guild2, :addons)
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

  def war_score(match, guild1, guild2, addons)
    war = match.war
    score1 = match.player1_score
    score2 = match.player2_score

    if !war.nil?
      if (war.guild1_id == match.guild1_id && score1 > score2) ||
         (war.guild1_id == match.guild2_id && score1 < score2)
        war.update(guild1_wins: (war.guild1_wins + 1))

      elsif (war.guild2_id == match.guild1_id && score1 > score2) ||
            (war.guild2_id == match.guild2_id && score1 < score2)
        war.update(guild2_wins: (war.guild2_wins + 1))
      end

    elsif !guild1.nil? && !guild1.war.nil? &&
          !guild2.nil? && !guild2.war.nil? &&
          guild1.war == guild2.war
      war = guild1.war
      if (war.addons.addon1 == addons.addon1 &&
          war.addons.addon2 == addons.addon2 &&
          war.addons.addon3 == addons.addon3)
        match.update(war_id: war.id)

        if (war.guild1_id == match.guild1_id && score1 > score2) ||
           (war.guild1_id == match.guild2_id && score1 < score2)

          war.update(guild1_wins: (war.guild1_wins + 1))

        elsif (war.guild2_id == match.guild1_id && score1 > score2) ||
              (war.guild2_id == match.guild2_id && score1 < score2)

          war.update(guild2_wins: (war.guild2_wins + 1))
        end
      end
    end
  end

  def set_win_loses(match)
    if (match.player1_score > match.player2_score)
      match.player1.update(wins: (match.player1.wins + 1))
      match.player2.update(loses: (match.player1.loses + 1))
    elsif (match.player1_score < match.player2_score)
      match.player1.update(loses: (match.player1.loses + 1))
      match.player2.update(wins: (match.player1.wins + 1))
    end
  end

  def tournament_score(match)
    
    tourn_match = TournamentMatch.where(match_id: match.id).first
    if tourn_match.nil?
      return
    end

    tourn_id = tourn_match.tournament_id

    if match.player1_score != match.player2_score
      user1 = TournamentUser.where(user_id: match.player1.id, tournament_id: tourn_id).first
      user2 = TournamentUser.where(user_id: match.player2.id, tournament_id: tourn_id).first

      if match.player1_score > match.player2_score
        user1.update(wins: (user1.wins + 1))
        user1.update(score: (user1.score + 1))

        user2.update(loses: (user2.loses + 1))

      else
        user2.update(wins: (user2.wins + 1))
        user2.update(score: (user2.score + 1))

        user1.update(loses: (user1.loses + 1))
      end
    end

  end

end
