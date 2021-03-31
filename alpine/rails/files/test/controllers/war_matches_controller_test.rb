require 'test_helper'

class WarMatchesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @war_match = war_matches(:one)
  end

  test "should get index" do
    get war_matches_url
    assert_response :success
  end

  test "should get new" do
    get new_war_match_url
    assert_response :success
  end

  test "should create war_match" do
    assert_difference('WarMatch.count') do
      post war_matches_url, params: { war_match: { match_id: @war_match.match_id, war_id: @war_match.war_id } }
    end

    assert_redirected_to war_match_url(WarMatch.last)
  end

  test "should show war_match" do
    get war_match_url(@war_match)
    assert_response :success
  end

  test "should get edit" do
    get edit_war_match_url(@war_match)
    assert_response :success
  end

  test "should update war_match" do
    patch war_match_url(@war_match), params: { war_match: { match_id: @war_match.match_id, war_id: @war_match.war_id } }
    assert_redirected_to war_match_url(@war_match)
  end

  test "should destroy war_match" do
    assert_difference('WarMatch.count', -1) do
      delete war_match_url(@war_match)
    end

    assert_redirected_to war_matches_url
  end
end
