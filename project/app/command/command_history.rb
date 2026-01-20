class CommandHistory
  attr_reader :session
  def initialize(session)
    @session=session
    @session[:undo_deque] ||= []
  end

  def push(command)
    history=@session[:undo_deque]
    history<<command
    history.shift if history.size > 8
    @session[:undo_deque] = history
  end

  def pop
    history = @session[:undo_deque]
    val=history.pop
    @session[:undo_deque]=history
    val
  end

  def empty?
    (@session[:undo_deque] || []).empty?
  end
end
