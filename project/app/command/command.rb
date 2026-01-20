class Command
    def execute
        raise NotImplementedError, "Subclasses must implement the execute method"
    end
    def undo
        raise NotImplementedError, "Subclasses must implement the undo method"
    end
    def description
        raise NotImplementedError, "Subclasses must implement the description method"
    end
end