require 'test_helper'

class MatchesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @match = matches(:one)
  end

  test "should get index" do
    get matches_url
    assert_response :success
  end

  test "should get new" do
    get new_match_url
    assert_response :success
  end

  test "should create match" do
    assert_difference('Match.count') do
      post matches_url, params: { match: { addons_id: @match.addons_id, guild_1_id: @match.guild_1_id, guild_2_id: @match.guild_2_id, is_end: @match.is_end, player_1_id: @match.player_1_id, player_1_score: @match.player_1_score, player_2_id: @match.player_2_id, player_2_score: @match.player_2_score } }
    end

    assert_redirected_to match_url(Match.last)
  end

  test "should show match" do
    get match_url(@match)
    assert_response :success
  end

  test "should get edit" do
    get edit_match_url(@match)
    assert_response :success
  end

  test "should update match" do
    patch match_url(@match), params: { match: { addons_id: @match.addons_id, guild_1_id: @match.guild_1_id, guild_2_id: @match.guild_2_id, is_end: @match.is_end, player_1_id: @match.player_1_id, player_1_score: @match.player_1_score, player_2_id: @match.player_2_id, player_2_score: @match.player_2_score } }
    assert_redirected_to match_url(@match)
  end

  test "should destroy match" do
    assert_difference('Match.count', -1) do
      delete match_url(@match)
    end

    assert_redirected_to matches_url
  end
end
