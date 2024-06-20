# auto-virtualenvwrapper

Automatically activate Python virtual environments as you navigate the source code.

This is useful if you are working with a monorepo that contains sub-projects, modules, libraries or deployments with different Python dependencies. Or perhaps you want to automatically activate a development environment when you click on a test file.

> Credits to [PythonEnvy](https://github.com/teticio/python-envy), inspiration and reference for creating this extension.

## Features

As you can see in the following demo, the active Python environment changes as soon as a file is loaded into the editor. The environment is set by looking for the first virtual environment with matching name to the containing directory. If none is found, we look for the upper directory, and so on.

![demo](/images/demo.gif)

## Requirements

The [Python extension](https://marketplace.visualstudio.com/items?itemName=ms-python.python) must be enabled for this to work.

## Extension Settings

This extension has the following setting:

* `autoVirtualenvwrapper.virtualenvsPath`: Path to virtualenvwrapper virtual environments directory. Defaults to `/.virtualenvs`. If you are on Mac, it probably is something similar to `/Users/javier/.virtualenvs`.

## Known Issues

N/A
