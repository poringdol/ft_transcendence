require "application_system_test_case"

class BlocklistsTest < ApplicationSystemTestCase
  setup do
    @blocklist = blocklists(:one)
  end

  test "visiting the index" do
    visit blocklists_url
    assert_selector "h1", text: "Blocklists"
  end

  test "creating a Blocklist" do
    visit blocklists_url
    click_on "New Blocklist"

    fill_in "Blocke user", with: @blocklist.blocked_user_id
    fill_in "User", with: @blocklist.user_id
    click_on "Create Blocklist"

    assert_text "Blocklist was successfully created"
    click_on "Back"
  end

  test "updating a Blocklist" do
    visit blocklists_url
    click_on "Edit", match: :first

    fill_in "Blocke user", with: @blocklist.blocked_user_id
    fill_in "User", with: @blocklist.user_id
    click_on "Update Blocklist"

    assert_text "Blocklist was successfully updated"
    click_on "Back"
  end

  test "destroying a Blocklist" do
    visit blocklists_url
    page.accept_confirm do
      click_on "Destroy", match: :first
    end

    assert_text "Blocklist was successfully destroyed"
  end
end
