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
    p "-----------------------------------"
    #p room_params
    p params
    p "-------------------------------------"
    if params[:password] != ""
      @room = Room.new(name: params[:name], password: BCrypt::Password.create(params[:password]))
    else
      @room = Room.new(name: params[:name])
    end
    @room.owner_id = current_user.id
    RoomUser.create(room_id: @room.id, user_id: current_user.id)

    respond_to do |format|
      if @room.save
        format.html { redirect_to "/rooms/#{@room.id}", notice: 'Room was successfully created.' }
        format.json { render :show, status: :created, location:"/rooms/#{@room.id}" }
      else
        format.html { render :new }
        format.json { render json: @room.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /rooms/1
  # PATCH/PUT /rooms/1.json
  def update
    respond_to do |format|
      if @room.update(room_params)
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

    if room_pass == params[:room][:password]
      RoomUser.create(user_id: current_user.id, room_id: params[:room][:id])
    end
    redirect_to "/rooms/#{params[:room][:id]}"
  end

  def leave
    RoomUser.where(room_id: @room.id, user_id: current_user.id).destroy_all
    redirect_to "/rooms/"
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_room
      @room = Room.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def room_params
      params.require(:room).permit(:name, :password)
    end
end
