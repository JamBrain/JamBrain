
TARGET				:=	public-jammer.bio

MAIN_FOLDER			:=	src/$(TARGET)
TARGET_FOLDER		:=	$(TARGET)/-/

INCLUDE_FOLDERS		:=	\
						src/shrub/js/ \
						src/com/ \
						src/custom/ \
						src/external/ \
						src/internal/ \
						src/main/ \
						src/icons/ \
						$(MAIN_FOLDER)/

MAIN_JS				:=	$(MAIN_FOLDER)/main-bio.js

# Include the main Makefile #
-include Makefile	# NOTE: This Makefile should be run from the root folder, not here! #

# Rules #
fail:
	@echo "[-] Failed to run \"$(TARGET)\""
