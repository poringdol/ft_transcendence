require "application_system_test_case"

class MatchesTest < ApplicationSystemTestCase
  setup do
    @match = matches(:one)
  end

  test "visiting the index" do
    visit matches_url
    assert_selector "h1", text: "Matches"
  end

  test "creating a Match" do
    visit matches_url
    click_on "New Match"

    fill_in "Addons", with: @match.addons_id
    fill_in "Guild 1", with: @match.guild_1_id
    fill_in "Guild 2", with: @match.guild_2_id
    check "Is end" if @match.is_end
    fill_in "Player 1", with: @match.player1_id
    fill_in "Player 1 score", with: @match.player1_score
    fill_in "Player 2", with: @match.player2_id
    fill_in "Player 2 score", with: @match.player2_score
    click_on "Create Match"

    assert_text "Match was successfully created"
    click_on "Back"
  end

  test "updating a Match" do
    visit matches_url
    click_on "Edit", match: :first

    fill_in "Addons", with: @match.addons_id
    fill_in "Guild 1", with: @match.guild_1_id
    fill_in "Guild 2", with: @match.guild_2_id
    check "Is end" if @match.is_end
    fill_in "Player 1", with: @match.player1_id
    fill_in "Player 1 score", with: @match.player1_score
    fill_in "Player 2", with: @match.player2_id
    fill_in "Player 2 score", with: @match.player2_score
    click_on "Update Match"

    assert_text "Match was successfully updated"
    click_on "Back"
  end

  test "destroying a Match" do
    visit matches_url
    page.accept_confirm do
      click_on "Destroy", match: :first
    end

    assert_text "Match was successfully destroyed"
  end
end
