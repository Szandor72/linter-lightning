linter-lightning
=========================

This Atom linter plugin for [Linter](https://github.com/AtomLinter/Linter) provides
an interface to [the Lightning Linter in the Heroku Toolbelt](https://developer.salesforce.com/docs/atlas.en-us.lightning.meta/lightning/cli_intro.htm).

#Caveat
- tested and working on a Mac
- Windows has PATH issues with sb_exec and the heroku toolbelt, any advise appreciated

##Features
- per file linting on save (deviation from default cli behaviour which scans whole directories only)
- will only lint lightning component .js files, no others
- show errors only
- use additional custom `.eslintrc` (not functional yet, will add if someone needs it)

## Installation
### `Toolbelt` installation
Before installing this plugin, you must ensure that `Heroku CLI toolbelt` is installed on your
system. For detailed instructions see [Heroku.com](https://devcenter.heroku.com/articles/heroku-cli)

### Plugin installation

After verifying that `Lightning Linter` works from your terminal, proceed to install the linter-lightning plugin as any other plugin. Should this __fail__, please:

    - copy to atom/packages
    - open terminal
    - run `adm install`


### Kudos to
- the makers of [linter-phpmd](https://github.com/AtomLinter/linter-phpmd) from which I created this linter
- [ArcaneMagus](https://github.com/Arcanemagus)
