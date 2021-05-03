class RoomsController < ApplicationController
  before_action :set_room, only: [:show, :edit, :update, :destroy]
  require 'bcrypt'

  # GET /rooms
  # GET /rooms.json
  def index
    @rooms = Room.all
  end

  # GET /rooms/1
  # GET /rooms/1.json
  def show
    @rooms = Room.all
    render 'index'
  end

  # GET /rooms/new
  def new
    @room = Room.new
  end

  # GET /rooms/1/edit
  def edit
  end

  # POST /rooms
  # POST /rooms.json
  def create

    if params[:room].present?
      pass = params[:room][:password]
      name = params[:room][:name]
    else
      pass = params[:password]
      name = params[:name]
    end

    direct_room_exists1 = Room.where(name: name + '-' + current_user.nickname).first
    direct_room_exists = Room.where(name: current_user.nickname + '-' + name).first
    if direct_room_exists1.present?
      direct_room_exists = direct_room_exists1
    end
    if direct_room_exists.present?
      respond_to do |format|
        format.html { redirect_to "/rooms/#{direct_room_exists.id}" }
        format.json { render json: direct_room_exists }
      end
    else

      if pass != ""
        @room = Room.new(name: name, password: BCrypt::Password.create(pass))
      else
        @room = Room.new(name: name)
      end

      direct_user = User.where(nickname: name).first
      if direct_user.present?
        @room.is_direct = true
        @room.name = name + '-' + current_user.nickname
      end

      @room.owner_id = current_user.id
      respond_to do |format|
        if @room.save
          if direct_user.present?
            RoomUser.create(room_id: @room.id, user_id: direct_user.id)
            NotificationJob.perform_later({
              user: direct_user,
              message: "#{current_user.nickname} created direct room with you",
              link: "/rooms/#{@room.id}"
            })
          end
          RoomUser.create(room_id: @room.id, user_id: current_user.id, is_admin: true)
          format.html { redirect_to "/rooms/#{@room.id}" }
          format.json { render :show, status: :created, location:"/rooms/#{@room.id}" }
        else
          format.html { render :new }
          format.json { render json: @room.errors, status: :unprocessable_entity }
        end
      end
    end
  end

  # PATCH/PUT /rooms/1
  # PATCH/PUT /rooms/1.json
  def update
    respond_to do |format|
      if @room.update(params)
        format.html { redirect_to @room }
        format.json { render :show, status: :ok, location: @room }
      else
        format.html { render :edit }
        format.json { render json: @room.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /rooms/1
  # DELETE /rooms/1.json
  def destroy
    @room.destroy
    respond_to do |format|
      format.html { redirect_to rooms_url }
      format.json { head :no_content }
    end
  end

  def pass_check
    @room = Room.find(params[:room][:id])
    room_pass = BCrypt::Password.new(@room.password)

    respond_to do |format|
      if room_pass == params[:room][:password]
        RoomUser.create(user_id: current_user.id, room_id: params[:room][:id])
        format.html { redirect_to "/rooms/#{params[:room][:id]}" }
        format.json { render :show, status: :ok, location: "/rooms/#{params[:room][:id]}" }
      else
        NotificationJob.perform_later({
          user: current_user,
          message: "Room #{@room.name} password wrong",
          link: ""
        })
        format.html { redirect_to "/rooms/#{params[:room][:id]}" }
        format.json { head :no_content }
      end
    end
  end

  def kick
    @room = Room.find(params[:room][:room_id])
    @user = User.find(params[:room][:user_id])
    if @room.owner_id == @user.id || @user.is_admin || @user.is_moderator
      NotificationJob.perform_later({
        user: current_user,
        message: "You can't kick chat owner",
        link: ""
      })
      return
    end
    RoomUser.where(room_id: params[:room][:room_id], user_id: params[:room][:user_id]).destroy_all
    NotificationJob.perform_later({
      user: @user,
      message: "You will be kicked from #{@room.name}",
      link: ""
    })
    NotificationJob.perform_later({
      user: current_user,
      message: "You kicked #{@user.nickname} from #{@room.name}",
      link: ""
    })
  end

  def leave
    @room = Room.find(params[:room][:room_id])
    if @room.owner_id == current_user.id
      RoomUser.where(room_id: params[:room][:room_id]).destroy_all
      @room.destroy
      respond_to do |format|
        NotificationJob.perform_later({
          user: current_user,
          message: "Room #{@room.name} was successfully destroyed",
          link: ""
        })
        format.html { redirect_to rooms_url }
        format.json { head :no_content }
      end
    else
      RoomUser.where(room_id: params[:room][:room_id], user_id: current_user.id).destroy_all
      respond_to do |format|
        format.html { redirect_to rooms_url }
        format.json { head :no_content }
      end
    end
  end

  def change_pass
    @room = Room.find(params[:room][:room_id])
    if @room.password.present? && @room.password != ""
      room_pass = BCrypt::Password.new(@room.password)
    else
      room_pass = ""
    end

    unless room_pass == params[:room][:password]
      if params[:room][:password] != ""
        @room.password = BCrypt::Password.create(params[:room][:password])
      else
        @room.password = ""
      end
      if @room.save
        NotificationJob.perform_later({
          user: current_user,
          message: "Room #{@room.name} password updated",
          link: ""
        })
      else
        NotificationJob.perform_later({
          user: current_user,
          message: "Room #{@room.name} password not updated",
          link: ""
        })
      end
    else
      NotificationJob.perform_later({
        user: current_user,
        message: "Room #{@room.name} password is the same",
        link: ""
      })
    end
  end

  def block_user
    if params[:room].present?
      user_id = params[:room][:user_id]
      blocked_user_id = params[:room][:blocked_user_id]
    else
      user_id = params[:user_id]
      blocked_user_id = params[:blocked_user_id]
    end

    Blocklist.create(user_id: user_id, blocked_user_id: blocked_user_id)
    NotificationJob.perform_later({
      user: current_user,
      message: "User #{User.find(blocked_user_id)} now in your block list",
      link: ""
    })
  end

  def do_admin
    user = RoomUser.where(user_id: params[:room][:user_id]).first
    user.is_admin = true
    user.save
    NotificationJob.perform_later({
      user: user,
      message: "Now you is room #{params[:room]} admin",
      link: ""
    })
  end

  def rm_admin
    user = RoomUser.where(user_id: params[:room][:user_id]).first
    user.is_admin = false
    user.save
    NotificationJob.perform_later({
      user: user,
      message: "Now you is not room #{params[:room]} admin",
      link: ""
    })
  end

  def mute_user
    user = RoomUser.where(user_id: params[:room][:user_id], room_id: params[:room][:room_id]).first
    room = Room.find(params[:room][:room_id])
    us = User.find(params[:room][:user_id])

    if room.owner_id == user.id || us.is_admin || us.is_moderator
      NotificationJob.perform_later({
        user: current_user,
        message: "You can't mute or ban chat owner",
        link: ""
      })
      return
    end

    if params[:room][:ban] == 'unban'
      user.is_muted = false
      user.save
    else
      user.is_muted = true
      user.save
    end
    if params[:room][:ban].nil?
      NotificationJob.perform_later({
        user: us,
        message: "You muted for 1 min in room #{room.name}",
        link: ""
      })
      MuteJob.set(wait: 1.minutes).perform_later(user)
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_room
      @room = Room.find(params[:id])
    end
end
