def parse(cmd, args, module):
    if args.kerchunk_command == "run":
        return module.run
    else:

        def e(*args):
            print(cmd.format_help())
            exit()

        return e
