require 'test_helper'

class BlocklistsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @blocklist = blocklists(:one)
  end

  test "should get index" do
    get blocklists_url
    assert_response :success
  end

  test "should get new" do
    get new_blocklist_url
    assert_response :success
  end

  test "should create blocklist" do
    assert_difference('Blocklist.count') do
      post blocklists_url, params: { blocklist: { blocked_user_id: @blocklist.blocked_user_id, user_id: @blocklist.user_id } }
    end

    assert_redirected_to blocklist_url(Blocklist.last)
  end

  test "should show blocklist" do
    get blocklist_url(@blocklist)
    assert_response :success
  end

  test "should get edit" do
    get edit_blocklist_url(@blocklist)
    assert_response :success
  end

  test "should update blocklist" do
    patch blocklist_url(@blocklist), params: { blocklist: { blocked_user_id: @blocklist.blocked_user_id, user_id: @blocklist.user_id } }
    assert_redirected_to blocklist_url(@blocklist)
  end

  test "should destroy blocklist" do
    assert_difference('Blocklist.count', -1) do
      delete blocklist_url(@blocklist)
    end

    assert_redirected_to blocklists_url
  end
end
