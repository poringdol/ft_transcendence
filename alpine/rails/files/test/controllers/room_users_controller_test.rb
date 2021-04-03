require 'test_helper'

class RoomUsersControllerTest < ActionDispatch::IntegrationTest
  setup do
    @room_user = room_users(:one)
  end

  test "should get index" do
    get room_users_url
    assert_response :success
  end

  test "should get new" do
    get new_room_user_url
    assert_response :success
  end

  test "should create room_user" do
    assert_difference('RoomUser.count') do
      post room_users_url, params: { room_user: {  } }
    end

    assert_redirected_to room_user_url(RoomUser.last)
  end

  test "should show room_user" do
    get room_user_url(@room_user)
    assert_response :success
  end

  test "should get edit" do
    get edit_room_user_url(@room_user)
    assert_response :success
  end

  test "should update room_user" do
    patch room_user_url(@room_user), params: { room_user: {  } }
    assert_redirected_to room_user_url(@room_user)
  end

  test "should destroy room_user" do
    assert_difference('RoomUser.count', -1) do
      delete room_user_url(@room_user)
    end

    assert_redirected_to room_users_url
  end
end
