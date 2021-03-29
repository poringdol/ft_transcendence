require "application_system_test_case"

class FriendsTest < ApplicationSystemTestCase
  setup do
    @friend = friends(:one)
  end

  test "visiting the index" do
    visit friends_url
    assert_selector "h1", text: "Friends"
  end

  test "creating a Friend" do
    visit friends_url
    click_on "New Friend"

    fill_in "Friend", with: @friend.friend_id
    fill_in "User", with: @friend.user_id
    click_on "Create Friend"

    assert_text "Friend was successfully created"
    click_on "Back"
  end

  test "updating a Friend" do
    visit friends_url
    click_on "Edit", match: :first

    fill_in "Friend", with: @friend.friend_id
    fill_in "User", with: @friend.user_id
    click_on "Update Friend"

    assert_text "Friend was successfully updated"
    click_on "Back"
  end

  test "destroying a Friend" do
    visit friends_url
    page.accept_confirm do
      click_on "Destroy", match: :first
    end

    assert_text "Friend was successfully destroyed"
  end
end
