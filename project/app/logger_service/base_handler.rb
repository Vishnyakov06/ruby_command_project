class BaseHandler
    include HandlerInterface
    def initialize(handler)
        @next=handler
    end
    def forward(request)
        if(@next.nil?)
            return
        end
        @next.log(request)
    end
end