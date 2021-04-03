class RoomsController < ApplicationController
  before_action :set_room, only: [:show, :edit, :update, :destroy]

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
    p "___________________________________"
    p params
    p room_params

    if room_params[:password] != ""
      p "IFFFFFFFFFFFFFFFFFFF"
      @room = Room.new(name: room_params[:name], password: BCrypt::Password.create(room_params[:password]))
    else
      p "ELSEEEEEEEEEEEEEEEEEEEEE"
      @room = Room.new(name: room_params[:name])
    end
    p "-----------------------------------"
    respond_to do |format|
      if @room.save
        format.html { redirect_to @room, notice: 'Room was successfully created.' }
        format.json { render :show, status: :created, location: @room }
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
    p "_______________________________-"
    p "rooms/chat_room/#{params[:room][:id]}"

    @room = Room.find(params[:room][:id])
    room_pass = Room.find(params[:room][:id]).password
    my_password = BCrypt::Password.create(params[:room][:password])


    if room_pass == my_password
      render 'index'
    end
    render 'chat_room'
    respond_to do |format|
      if room_pass == my_password
        format.html { render "rooms/chat_room", notice: 'Room was successfully updated.' }
        format.json { render :show, status: :ok, location: "rooms/chat_room" }
      else
        format.html { render :edit }
        format.json { render json: @room.errors, status: :unprocessable_entity }
      end
    end
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
