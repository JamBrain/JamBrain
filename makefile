
-include config.mk	# Create and use this file to override any of 'Settings'. Use '=', not ':=' #

# Settings #
SRC					=	src
OUT					=	.output

STATIC_DOMAIN		=	static.jammer.work

# Functions (must use '=', and not ':=') #
REMOVE_UNDERSCORE	=	$(foreach v,$(1),$(if $(findstring /_,$(v)),,$(v)))
FIND_FILE			=	$(call REMOVE_UNDERSCORE,$(shell find $(1) -name '$(2)'))

# Files #
ALL_JS_FILES		:=	$(filter-out %.min.js,$(call FIND_FILE,$(SRC)/,*.js))
ALL_LESS_FILES		:=	$(call FIND_FILE,$(SRC)/,*.less)
ALL_CSS_FILES		:=	$(call FIND_FILE,$(SRC)/,*.css)
ALL_SVG_FILES		:=	$(call FIND_FILE,$(SRC)/,*.svg)

ALL_ES6IGNORE_FILES	:=	$(call FIND_FILE,$(SRC)/,.es6ignore)
ALL_BUILD_FILES		:=	$(call FIND_FILE,$(SRC)/,build.json)

ES6IGNORE_FOLDERS	:=	$(addsuffix %,$(dir $(ALL_ES6IGNORE_FILES)))

# Transforms #
ES6_FILES 			:=	$(filter-out $(ES6IGNORE_FOLDERS),$(ALL_JS_FILES))
JS_FILES 			:=	$(filter $(ES6IGNORE_FOLDERS),$(ALL_JS_FILES))
LESS_FILES			:=	$(ALL_LESS_FILES)
CSS_FILES			:=	$(ALL_CSS_FILES)
SVG_FILES			:=	$(ALL_SVG_FILES)

OUT_ES6_FILES		:=	$(subst $(SRC)/,$(OUT)/,$(ES6_FILES:.js=.es6.js))
OUT_JS_FILES		:=	$(subst $(SRC)/,$(OUT)/,$(JS_FILES:.js=.o.js))
OUT_LESS_FILES		:=	$(subst $(SRC)/,$(OUT)/,$(LESS_FILES:.less=.less.css))
OUT_CSS_FILES		:=	$(subst $(SRC)/,$(OUT)/,$(CSS_FILES:.css=.o.css))
OUT_SVG_FILES		:=	$(subst $(SRC)/,$(OUT)/,$(SVG_FILES:.svg=.o.svg))

OUT_FILES			:=	$(OUT_ES6_FILES) $(OUT_JS_FILES) $(OUT_LESS_FILES) $(OUT_CSS_FILES) $(OUT_SVG_FILES)
DEP_FILES			:=	$(addsuffix .dep,$(OUT_ES6_FILES) $(OUT_LESS_FILES))
OUT_FOLDERS			:=	$(sort $(dir $(OUT_FILES)))

# Tools #
BUBLE				:=	
ROLLUP				:=	

LESS_COMMON			:=	--global-var='STATIC_DOMAIN=$(STATIC_DOMAIN)'
LESS_ARGS			:=	--autoprefix
LESS_DEP			=	lessc $(LESS_COMMON) --depends $(1) $(2)>$(2).dep
LESS				=	lessc $(LESS_COMMON) $(LESS_ARGS) $(1) $(2)


# Rules #
default: $(OUT_FOLDERS) $(OUT_FILES)
	@echo Done.

clean:
	rm -fr $(OUT)

$(OUT_FOLDERS):
	mkdir -p $@

# File Types #
$(OUT)/%.es6.js:$(SRC)/%.js
	@echo TODO: $@
	@touch $@

$(OUT)/%.o.js:$(SRC)/%.js
	cp $< $@

$(OUT)/%.less.css:$(SRC)/%.less
	$(call LESS,$<,$@); $(call LESS_DEP,$<,$@)

$(OUT)/%.o.css:$(SRC)/%.css
	cp $< $@

$(OUT)/%.o.svg:$(SRC)/%.svg
	cp $< $@

# Phony Rules #
.phony: default clean

# Dependencies #
-include $(DEP_FILES)
