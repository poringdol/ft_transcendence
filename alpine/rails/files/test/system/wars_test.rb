require "application_system_test_case"

class WarsTest < ApplicationSystemTestCase
  setup do
    @war = wars(:one)
  end

  test "visiting the index" do
    visit wars_url
    assert_selector "h1", text: "Wars"
  end

  test "creating a War" do
    visit wars_url
    click_on "New War"

    fill_in "Addons", with: @war.addons_id
    fill_in "End", with: @war.end
    fill_in "Guild 1", with: @war.guild_1_id
    fill_in "Guild 1 wins", with: @war.guild_1_wins
    fill_in "Guild 2", with: @war.guild_2_id
    fill_in "Guild 2 wins", with: @war.guild_2_wins
    fill_in "Max unanswered", with: @war.max_unanswered
    fill_in "Prize", with: @war.prize
    fill_in "Start", with: @war.start
    click_on "Create War"

    assert_text "War was successfully created"
    click_on "Back"
  end

  test "updating a War" do
    visit wars_url
    click_on "Edit", match: :first

    fill_in "Addons", with: @war.addons_id
    fill_in "End", with: @war.end
    fill_in "Guild 1", with: @war.guild_1_id
    fill_in "Guild 1 wins", with: @war.guild_1_wins
    fill_in "Guild 2", with: @war.guild_2_id
    fill_in "Guild 2 wins", with: @war.guild_2_wins
    fill_in "Max unanswered", with: @war.max_unanswered
    fill_in "Prize", with: @war.prize
    fill_in "Start", with: @war.start
    click_on "Update War"

    assert_text "War was successfully updated"
    click_on "Back"
  end

  test "destroying a War" do
    visit wars_url
    page.accept_confirm do
      click_on "Destroy", match: :first
    end

    assert_text "War was successfully destroyed"
  end
end
