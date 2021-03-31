require 'test_helper'

class WarsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @war = wars(:one)
  end

  test "should get index" do
    get wars_url
    assert_response :success
  end

  test "should get new" do
    get new_war_url
    assert_response :success
  end

  test "should create war" do
    assert_difference('War.count') do
      post wars_url, params: { war: { addons_id: @war.addons_id, end: @war.end, guild_1_id: @war.guild_1_id, guild_1_wins: @war.guild_1_wins, guild_2_id: @war.guild_2_id, guild_2_wins: @war.guild_2_wins, max_unanswered: @war.max_unanswered, prize: @war.prize, start: @war.start } }
    end

    assert_redirected_to war_url(War.last)
  end

  test "should show war" do
    get war_url(@war)
    assert_response :success
  end

  test "should get edit" do
    get edit_war_url(@war)
    assert_response :success
  end

  test "should update war" do
    patch war_url(@war), params: { war: { addons_id: @war.addons_id, end: @war.end, guild_1_id: @war.guild_1_id, guild_1_wins: @war.guild_1_wins, guild_2_id: @war.guild_2_id, guild_2_wins: @war.guild_2_wins, max_unanswered: @war.max_unanswered, prize: @war.prize, start: @war.start } }
    assert_redirected_to war_url(@war)
  end

  test "should destroy war" do
    assert_difference('War.count', -1) do
      delete war_url(@war)
    end

    assert_redirected_to wars_url
  end
end
