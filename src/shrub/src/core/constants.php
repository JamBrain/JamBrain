<?php
/// @defgroup Shrub
/// @brief The Shrub CMS/CMW backend.

/// @defgroup Core
/// @ingroup Shrub

/// @defgroup Constants
/// @ingroup Shrub
 
/// @defgroup Modules
/// @ingroup Shrub

/// @defgroup Tables
/// @brief Database Tables
/// @ingroup Constants

/// @defgroup NodeIds Node Id's
/// @brief Hardcoded Node Id's
/// @ingroup Constants

///	@defgroup NodeTypes Node Types
/// @brief Short strings that define the type of the Node
/// @ingroup Constants

/// @defgroup DBParseRowFields db_ParseRow Fields
/// @brief Constants used to tell db_ParseRow how to reinterpret fields
/// @ingroup Constants
/// @{
const SH_FIELD_TYPE_IGNORE = 0;			///< This means field will be unset. Prefer a custom query w/o field instead.
const SH_FIELD_TYPE_STRING = 1;			///< Has no effect (values are strings by default)
const SH_FIELD_TYPE_INT = 2;
const SH_FIELD_TYPE_FLOAT = 3;
const SH_FIELD_TYPE_DATETIME = 4;
const SH_FIELD_TYPE_JSON = 5;
/// @}
