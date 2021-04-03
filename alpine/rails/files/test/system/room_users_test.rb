require "application_system_test_case"

class RoomUsersTest < ApplicationSystemTestCase
  setup do
    @room_user = room_users(:one)
  end

  test "visiting the index" do
    visit room_users_url
    assert_selector "h1", text: "Room Users"
  end

  test "creating a Room user" do
    visit room_users_url
    click_on "New Room User"

    click_on "Create Room user"

    assert_text "Room user was successfully created"
    click_on "Back"
  end

  test "updating a Room user" do
    visit room_users_url
    click_on "Edit", match: :first

    click_on "Update Room user"

    assert_text "Room user was successfully updated"
    click_on "Back"
  end

  test "destroying a Room user" do
    visit room_users_url
    page.accept_confirm do
      click_on "Destroy", match: :first
    end

    assert_text "Room user was successfully destroyed"
  end
end
