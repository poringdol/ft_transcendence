class WarUpdateJob < ApplicationJob
  queue_as :default

  def perform(war, action)

  if action == "start"
    p "start start start start start start start start start start start start start start start start start "
    p "start start start start start start start start start start start start start start start start start "
    p "start start start start start start start start start start start start start start start start start "
    p "start start start start start start start start start start start start start start start start start "
    p "start start start start start start start start start start start start start start start start start "
    war.guild_1.update(is_in_war: true)
    war.guild_2.update(is_in_war: true)
    war.update(is_inprogress: true)

  elsif action == "end"
    p "end end end end end end end end end end end end end end end end end end end end end end end end end end "
    p "end end end end end end end end end end end end end end end end end end end end end end end end end end "
    p "end end end end end end end end end end end end end end end end end end end end end end end end end end "
    p "end end end end end end end end end end end end end end end end end end end end end end end end end end "
    p "end end end end end end end end end end end end end end end end end end end end end end end end end end "
    war.guild_1.update(is_in_war: false)
    war.guild_2.update(is_in_war: false)
    war.update(is_inprogress: false)
    war.update(is_end: true)

    end
  end
end
