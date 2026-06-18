# The shared INTERFACE. Every output must inherit from Handler and must
# define `handle(event)`.
#
# Ruby has no "abstract" keyword, so we enforce the contract at runtime:
# if an output forgets to write its own `handle`, this version runs and
# raises loudly instead of failing silently.
class Handler
  def handle(event)
    raise NotImplementedError, "#{self.class} must implement `handle`"
  end
end
