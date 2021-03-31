require "application_system_test_case"

class WarMatchesTest < ApplicationSystemTestCase
  setup do
    @war_match = war_matches(:one)
  end

  test "visiting the index" do
    visit war_matches_url
    assert_selector "h1", text: "War Matches"
  end

  test "creating a War match" do
    visit war_matches_url
    click_on "New War Match"

    fill_in "Match", with: @war_match.match_id
    fill_in "War", with: @war_match.war_id
    click_on "Create War match"

    assert_text "War match was successfully created"
    click_on "Back"
  end

  test "updating a War match" do
    visit war_matches_url
    click_on "Edit", match: :first

    fill_in "Match", with: @war_match.match_id
    fill_in "War", with: @war_match.war_id
    click_on "Update War match"

    assert_text "War match was successfully updated"
    click_on "Back"
  end

  test "destroying a War match" do
    visit war_matches_url
    page.accept_confirm do
      click_on "Destroy", match: :first
    end

    assert_text "War match was successfully destroyed"
  end
end
