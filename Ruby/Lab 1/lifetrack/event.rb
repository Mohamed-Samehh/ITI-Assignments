# An Event is just DATA. It carries the facts about one logged life event.
# It does NOT know how it will be printed, saved, or shown. That is the
# outputs' job. (This is why every output can read from it the same way.)
class Event
  attr_reader :category, :description, :duration, :time

  def initialize(category, description, duration)
    @category    = category      # "work" / "study" / "exercise" / "meal"
    @description = description    # what the user typed
    @duration    = duration      # minutes (a number)
    @time        = Time.now      # stamped the moment it is created
  end

  # One ready-to-read line that every output can reuse.
  # Example: [2026-06-19 14:51] STUDY — Ruby SOLID (45 min)
  def to_line
    stamp = @time.strftime("%Y-%m-%d %H:%M")
    "[#{stamp}] #{@category.upcase} — #{@description} (#{@duration} min)"
  end
end
