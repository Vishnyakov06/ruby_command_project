module HandlerInterface
  def log(request)
    raise NotImplementedError, 'You must implement the log method'
  end
end