
-include config.mk	# Create and use this file to override any of 'Settings' #

# Settings #
SRC					?=	src
OUT					?=	.output
#OUT					?=	$(HOME)/.starship
.BUILD				?=	.build
NODEJS				?=	node_modules

# Use 'TARGET=public-blah' if you want to build a specific build "blah" #
ifdef TARGET
ALL_MAKEFILES		:=	$(SRC)/$(subst /,,$(TARGET))/Makefile
endif # BUILD

# TODO: REMOVE THIS
STATIC_DOMAIN		?=	static.jammer.work

# Copy un-minified files
ifdef WINDOWS_HOST
COPY_UNMIN			:= true
endif # WINDOWS_HOST

# Include Folders (modified by recursive scripts) #
ifdef INCLUDE_FOLDERS
INCLUDE_FOLDERS		+=	src/compat/
endif
INCLUDE_FOLDERS		?=	$(SRC)/
BUILD_FOLDER		:=	$(OUT)/$(.BUILD)/$(subst /,,$(TARGET))

# Functions (must use '=', and not ':=') #
REMOVE_UNDERSCORE	=	$(foreach v,$(1),$(if $(findstring /_,$(v)),,$(v)))
INCLUDE_INCLUDES	=	$(filter $(addsuffix %,$(dir $(INCLUDE_FOLDERS))),$(1))
FIND_FILE			=	$(call REMOVE_UNDERSCORE,$(call INCLUDE_INCLUDES,$(shell find $(1) -name '$(2)')))
# NOTE: My standard build tree rule is to ignore any file/folder prefixed with an underscore #

# Files #
ALL_JS_FILES		:=	$(filter-out %.min.js,$(call FIND_FILE,$(SRC)/,*.js))
ALL_LESS_FILES		:=	$(filter-out %.min.less,$(call FIND_FILE,$(SRC)/,*.less))
ALL_CSS_FILES		:=	$(filter-out %.min.css,$(call FIND_FILE,$(SRC)/,*.css))
ALL_SVG_FILES		:=	$(filter-out %.min.svg,$(call FIND_FILE,$(SRC)/,*.svg))

ALL_ES6IGNORE_FILES	:=	$(call FIND_FILE,$(SRC)/,.es6ignore)
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
OUT_SVG_FILES		:=	$(subst $(SRC)/,$(OUT)/,$(SVG_FILES:.svg=.min.svg))

OUT_FILES			:=	$(OUT_SVG_FILES) $(OUT_CSS_FILES) $(OUT_LESS_FILES) $(OUT_JS_FILES) $(OUT_ES6_FILES)
DEP_FILES			:=	$(addsuffix .dep,$(OUT_ES6_FILES) $(OUT_LESS_FILES))
OUT_FOLDERS			:=	$(sort $(dir $(OUT_FILES) $(BUILD_FOLDER)/))

TARGET_FILES		:=	$(TARGET_FOLDER)/all.min.svg $(TARGET_FOLDER)/all.min.css $(TARGET_FOLDER)/all.min.js
TARGET_DEPS			:=	$(OUT_FOLDERS) $(TARGET_FILES)


# Tools #
ESLINT_ARGS			:=	--config src/config/eslint.config.json
ESLINT				=	$(NODEJS)/eslint/bin/eslint.js $(1) $(ESLINT_ARGS)
# Ecmascript Linter: http://eslint.org/
BUBLE_ARGS			:=	--no modules --jsx h --objectAssign Object.assign
BUBLE				=	$(NODEJS)/buble/bin/buble $(BUBLE_ARGS) $(1) -o $(2)
# ES6 Compiler: https://buble.surge.sh/guide/
ROLLUP_ARGS			:=	-c src/config/rollup.config.js
ROLLUP				=	$(NODEJS)/rollup/bin/rollup $(ROLLUP_ARGS) $(1) > $(2)
# ES6 Include/Require Resolver: http://rollupjs.org/guide/
MINIFY_JS_RESERVED	:=	VERSION_STRING,STATIC_DOMAIN
MINIFY_JS_ARGS		:=	--compress --mangle -r "$(MINIFY_JS_RESERVED)"
MINIFY_JS			=	$(NODEJS)/uglify-js/bin/uglifyjs $(MINIFY_JS_ARGS) -o $(2) -- $(1)
# JS Minifier: https://github.com/mishoo/UglifyJS2

LESS_COMMON			:=	--global-var='STATIC_DOMAIN=$(STATIC_DOMAIN)' --include-path=$(MAIN_FOLDER)
LESS_ARGS			:=	--autoprefix
LESS_DEP			=	$(NODEJS)/less/bin/lessc $(LESS_COMMON) --depends $(1) $(2)>$(2).dep
LESS				=	$(NODEJS)/less/bin/lessc $(LESS_COMMON) $(LESS_ARGS) $(1) $(2)
# CSS Compiler: http://lesscss.org/
MINIFY_CSS			=	cat $(1) | $(NODEJS)/clean-css-cli/bin/cleancss -o $(2)
# CSS Minifier: https://github.com/jakubpawlowicz/clean-css/
STYLELINT_ARGS			:=	--syntax less
STYLELINT				=	$(NODEJS)/stylelint/bin/stylelint.js $(1) $(STYLELINT_ARGS)
# CSS Linter: http://stylelint.io/

SVGO_ARGS			:=	-q --disable=removeTitle --disable=removeDimensions --disable=removeViewBox
SVGO				=	$(NODEJS)/svgo/bin/svgo $(SVGO_ARGS) -i $(1) -o $(2)
# SVG "Compiler", same as the minifier: https://github.com/svg/svgo
SVG_PACK			=	src/tools/svg-sprite-pack $(1) > $(2)
# Mike's SVG Sprite Packer: https://github.com/povrazor/svg-sprite-tools
MINIFY_SVG_ARGS		:=	--multipass --disable=cleanupIDs -q
MINIFY_SVG			=	$(NODEJS)/svgo/bin/svgo $(MINIFY_SVG_ARGS) -i $(1) -o $(2)
# SVG Minifier: https://github.com/svg/svgo

SIZE				=	cat $(1) | wc -c
GZIP_SIZE			=	gzip -c $(1) | wc -c
# Get size in bytes (compress and uncompressed)


# Rules #
default: target

clean-target:
	rm -f $(TARGET_FILES)

report: $(TARGET_FILES)
	@echo \
		"[JS]  GZIP: `$(call GZIP_SIZE,$(TARGET_FOLDER)/all.min.js 2>/dev/null)` (`$(call GZIP_SIZE,$(BUILD_FOLDER)/all.js 2>/dev/null)`)	[Minified: `$(call SIZE,$(TARGET_FOLDER)/all.min.js 2>/dev/null)`]	[Original: `$(call SIZE,$(BUILD_FOLDER)/all.js 2>/dev/null)`]\n" \
		"[CSS] GZIP: `$(call GZIP_SIZE,$(TARGET_FOLDER)/all.min.css 2>/dev/null)` (`$(call GZIP_SIZE,$(BUILD_FOLDER)/all.css 2>/dev/null)`)	[Minified: `$(call SIZE,$(TARGET_FOLDER)/all.min.css 2>/dev/null)`]	[Original: `$(call SIZE,$(BUILD_FOLDER)/all.css 2>/dev/null)`]\n" \
		"[SVG] GZIP: `$(call GZIP_SIZE,$(TARGET_FOLDER)/all.min.svg 2>/dev/null)` (`$(call GZIP_SIZE,$(BUILD_FOLDER)/all.svg 2>/dev/null)`)	[Minified: `$(call SIZE,$(TARGET_FOLDER)/all.min.svg 2>/dev/null)`]	[Original: `$(call SIZE,$(BUILD_FOLDER)/all.svg 2>/dev/null)`]\n" \
		| column -t

# If not called recursively, figure out who the targes are and call them #
ifndef MAIN_FOLDER # ---- #

ALL_MAKEFILES		?=	$(call FIND_FILE,$(SRC)/,Makefile)
BUILDS				:=	$(subst $(SRC)/,$(OUT)/$(.BUILD)/,$(ALL_MAKEFILES))

clean:
	rm -fr $(OUT)
	@$(foreach b,$(ALL_MAKEFILES),$(MAKE) clean-target -r --no-print-directory -C . -f $(subst $(OUT)/$(.BUILD)/,$(SRC)/,$(b));)

#ifdef COPY_UNMIN
#	rm -f $(TARGET_FOLDER)/all.js
#	rm -f $(TARGET_FOLDER)/all.css
#	rm -f $(TARGET_FOLDER)/all.svg
#endif # COPY_UNMIN

clean-version:
	rm $(OUT)/git-version.php

mini: clean-version target

target: $(BUILDS) $(OUT)/git-version.php
# NOTE: git-version should be last! Generation of this file doubles as the "install complete" notification.

$(BUILDS):
	@echo "[+] Building \"$(subst /Makefile,,$(subst $(OUT)/$(.BUILD)/,,$@))\"..."
	@$(MAKE) --no-print-directory -C . -f $(subst $(OUT)/$(.BUILD)/,$(SRC)/,$@)

endif # $(BUILDS) # ---- #


# Folder Rules #
$(OUT_FOLDERS):
	mkdir -p $@


# File Rules #
$(OUT)/%.es6.js:$(SRC)/%.js
	$(call ESLINT,$<)
	$(call BUBLE,$<,$@)

$(OUT)/%.o.js:$(SRC)/%.js
	cp $< $@

$(OUT)/%.less.css:$(SRC)/%.less
	$(call STYLELINT,$<)
	$(call LESS,$<,$@); $(call LESS_DEP,$<,$@)

$(OUT)/%.o.css:$(SRC)/%.css
	cp $< $@

$(OUT)/%.min.svg:$(SRC)/%.svg
	$(call SVGO,$<,$@)

# Concat Rules #
ifdef MAIN_FOLDER # ---- #

OUT_MAIN_JS			:=	$(subst $(SRC)/,$(OUT)/,$(MAIN_JS:.js=.es6.js))

# JavaScript #
$(BUILD_FOLDER)/js.js: $(OUT_JS_FILES)
	cat $^ > $@
$(BUILD_FOLDER)/buble.js: $(OUT_MAIN_JS) $(OUT_ES6_FILES)
	$(call ROLLUP,$<,$@.tmp)
	rm -f $@
	mv $@.tmp $@
$(BUILD_FOLDER)/all.js: $(BUILD_FOLDER)/js.js $(BUILD_FOLDER)/buble.js
	cat $^ > $@
$(TARGET_FOLDER)/all.min.js: $(BUILD_FOLDER)/all.js
	$(call MINIFY_JS,$<,$@)
ifdef COPY_UNMIN
	cp -f --remove-destination $< $(subst all.min.js,all.js,$@)
endif # COPY_UNMIN

# CSS #
$(BUILD_FOLDER)/css.css: $(OUT_CSS_FILES)
	cat $^ > $@
$(BUILD_FOLDER)/less.css: $(OUT_LESS_FILES)
	cat $^ > $@
$(BUILD_FOLDER)/all.css: $(BUILD_FOLDER)/css.css $(BUILD_FOLDER)/less.css
	cat $^ > $@
$(TARGET_FOLDER)/all.min.css: $(BUILD_FOLDER)/all.css
	$(call MINIFY_CSS,$<,$@)
ifdef COPY_UNMIN
	cp -f --remove-destination $< $(subst all.min.css,all.css,$@)
endif # COPY_UNMIN

# SVG # src/icons/icomoon/icons.svg
$(BUILD_FOLDER)/svg.svg: $(OUT_SVG_FILES)
	$(call SVG_PACK,$^,$@.out)
	cat $@.out > $@
#	cat $^ > $@
$(BUILD_FOLDER)/all.svg: $(BUILD_FOLDER)/svg.svg
	cat $^ > $@
$(TARGET_FOLDER)/all.min.svg: $(BUILD_FOLDER)/all.svg
	$(call MINIFY_SVG,$<,$@)
ifdef COPY_UNMIN
	cp -f --remove-destination $< $(subst all.min.svg,all.svg,$@)
endif # COPY_UNMIN

# Target #
target: $(TARGET_DEPS) report
	@echo "[-] Done \"$(subst /,,$(TARGET))\""

endif # MAIN_FOLDER # ---- #


# Generate GIT VERSION file #
$(OUT)/git-version.php:
	@echo "[+] Generating \"$@\"..."
	@echo "<?php">$@
	@echo "// WARNING! DO NOT MODIFY! This file is automatically generated by Makefile!">>$@
	@echo "">>$@
	@echo "const GIT_VERSION = '$(shell git rev-list HEAD | wc -l)-$(shell git describe --always)';">>$@
	@echo "[-] Done \"$@\""


# Phony Rules #
.PHONY: default build clean target clean-target clean-version fail report $(BUILDS)


# Dependencies #
-include $(DEP_FILES)
