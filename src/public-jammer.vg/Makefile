
TARGET				:=	public-jammer.vg

MAIN_FOLDER			:=	src/$(TARGET)
TARGET_FOLDER		:=	$(TARGET)/-/

INCLUDE_FOLDERS		:=	src/com/ \
						src/custom/ \
						src/external/ \
						src/internal/ \
						src/main/ \
						src/icons/ \
						$(MAIN_FOLDER)/

MAIN_JS				:=	$(MAIN_FOLDER)/../main/main.js
#MAIN_JS				:=	$(MAIN_FOLDER)/main.js

# Include the main Makefile #
-include Makefile	# NOTE: This Makefile should be run from the root folder, not here! #

# Rules #
fail:
	@echo "[-] Failed to run \"$(TARGET)\""

target: $(TARGET_DEPS)
	@echo "[-] Done \"$(TARGET)\""

# Phony Rules #
phony: fail target
