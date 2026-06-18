# The ROUTER (Observer pattern).
# It knows NOTHING about Console / File / Html. It only knows it holds a list
# of handlers, and that each one answers `handle`. Search this file for any
# concrete output class name -> you will find zero. That is the point.
class EventRouter
  def initialize
    @handlers = []
  end

  # Subscribe a handler (anything that responds to `handle`).
  def register(handler)
    @handlers << handler
  end

  # Send ONE event to EVERY registered handler.
  def dispatch(event)
    @handlers.each { |handler| handler.handle(event) }
  end
end
