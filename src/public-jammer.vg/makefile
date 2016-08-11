
TARGET				:=	jammer.vg

MAIN_FOLDER			:=	src/public-jammer.vg/
INCLUDE_FOLDERS		:=	src/com/ \
						src/custom/ \
						src/external/ \
						src/internal/ \
						src/main/ \
						src/icons/ \
						$(MAIN_FOLDER)

MAIN_JS				:=	$(MAIN_FOLDER)/main.js


# NOTE: This makefile should be run from the root folder, not here! #
-include makefile

fail:
	@echo "Failed to run \"$(TARGET)\"."

target: $(TARGETS)
	@echo "Done \"$(TARGET)\"."

phony: fail target
