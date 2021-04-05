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

    direct_room_exists = Room.where(name: name + '-' + current_user.nickname).first
    if direct_room_exists.present?
      respond_to do |format|
        format.html { redirect_to "/rooms/#{direct_room_exists.id}" }
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
        format.html { redirect_to @room, notice: 'Room was successfully updated.' }
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
      format.html { redirect_to rooms_url, notice: 'Room was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  def pass_check
    room_pass = BCrypt::Password.new(Room.find(params[:room][:id]).password)

    respond_to do |format|
      if room_pass == params[:room][:password]
        RoomUser.create(user_id: current_user.id, room_id: params[:room][:id])
        format.html { redirect_to "/rooms/#{params[:room][:id]}", notice: 'Pass rigth' }
        format.json { render :show, status: :ok, location: "/rooms/#{params[:room][:id]}" }
      else
        format.html { redirect_to "/rooms/#{params[:room][:id]}", notice: 'Pass wrong' }
        format.json { head :no_content }
      end
    end
  end

  # REFRESH
  def leave
    @room = Room.find(params[:room][:room_id])
    if @room.owner_id == current_user.id
      RoomUser.where(room_id: params[:room][:room_id]).destroy_all
      @room.destroy
      respond_to do |format|
        format.html { redirect_to rooms_url, notice: 'Room was successfully destroyed.' }
        format.json { head :no_content }
      end
    else
      RoomUser.where(room_id: params[:room][:room_id], user_id: current_user.id).destroy_all
      respond_to do |format|
        format.html { redirect_to rooms_url, notice: 'Leaved from room' }
        format.json { head :no_content }
      end
    end
  end

  def change_pass
    @room = Room.find(params[:room][:room_id])
    if params[:room][:password] != ""
      @room.password = BCrypt::Password.create(params[:room][:password])
    else
      @room.password = ""
    end

    respond_to do |format|
      if @room.save
        format.html { redirect_to "/rooms/#{@room.id}", notice: 'Password updated' }
        format.json { head :no_content }
      else
        format.html { redirect_to "/rooms/#{@room.id}", notice: 'Password not updated' }
        format.json { head :no_content }
      end
    end
  end

  def do_admin
    user = RoomUser.where(user_id: params[:room][:user_id]).first
    user.is_admin = true
    user.save
  end

  def rm_admin
    user = RoomUser.where(user_id: params[:room][:user_id]).first
    user.is_admin = false
    user.save
  end

  def mute_user
    user = RoomUser.where(user_id: params[:room][:user_id], room_id: params[:room][:room_id]).first

    user.is_muted = true
    user.save
    sleep(60)
    user.is_muted = false
    user.save
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_room
      @room = Room.find(params[:id])
    end
end
