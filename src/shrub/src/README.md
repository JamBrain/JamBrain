# Shrub Backend Internals
These are the internal calls and libraries used by the API and the server side tools.

Each folder has one or more optional files that tie it to the internals. If writing a backend plugin, this is where you do it. Create your own folder, and make sure these files exist. You can use other folders as reference, but do note `src/config/` is different then the rest, and `src/core/` doesn't have database tables (but it does define some of the Doxygen root data).

* `item/constants.php` - run `src/gen.sh` to update

If the item has database tables:

* `item/table_create.php` - run `tools/table_create` to create tables
* `item/table_destroy.php` - run `tools/table_destroy` to destroy tables

And as it was suggested above, Doxygen can be used to generate documentation. Simply run `doxygen` in the root `shrub` folder. If you are creating your own plugin, add its unique calls to its own Doxygen module, but do add the Tables to the `"Tables"` module so all table constants can be found in one place.
