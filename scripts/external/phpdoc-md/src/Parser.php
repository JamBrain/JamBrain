<?php

namespace PHPDocMD;

use SimpleXMLElement;

/**
 * This class parses structure.xml and generates the api documentation.
 *
 * @copyright Copyright (C) 2007-2012 Rooftop Solutions. All rights reserved.
 * @author    Evert Pot (http://www.rooftopsolutions.nl/)
 * @license   Mit
 */
class Parser
{
    /**
     * Path to the structure.xml file.
     *
     * @var string
     */
    protected $structureXmlFile;

    /**
     * The list of classes and interfaces.
     *
     * @var array
     */
    protected $classDefinitions;

    /**
     * @param string $structureXmlFile
     */
    public function __construct($structureXmlFile)
    {
        $this->structureXmlFile = $structureXmlFile;
    }

    /**
     * Starts the process.
     */
    public function run()
    {
        $xml = simplexml_load_file($this->structureXmlFile);

        $this->getClassDefinitions($xml);

        foreach ($this->classDefinitions as $className => $classInfo) {
            $this->expandMethods($className);
            $this->expandProperties($className);
        }

        return $this->classDefinitions;
    }

    /**
     * Gets all classes and interfaces from the file and puts them in an easy to use array.
     *
     * @param SimpleXmlElement $xml
     */
    protected function getClassDefinitions(SimpleXmlElement $xml)
    {
        $classNames = array();

        foreach ($xml->xpath('file/class|file/interface') as $class) {
            $className = (string) $class->full_name;
            $className = ltrim($className, '\\');

            $fileName = str_replace('\\', '-', $className) . '.md';

            $implements = array();

            if (isset($class->implements)) {
                foreach ($class->implements as $interface) {
                    $implements[] = ltrim((string) $interface, '\\');
                }
            }

            $extends = array();

            if (isset($class->extends)) {
                foreach ($class->extends as $parent) {
                    $extends[] = ltrim((string) $parent, '\\');
                }
            }

            $classNames[$className] = array(
                'fileName'        => $fileName,
                'className'       => $className,
                'shortClass'      => (string) $class->name,
                'namespace'       => (string) $class['namespace'],
                'description'     => (string) $class->docblock->description,
                'longDescription' => (string) $class->docblock->{'long-description'},
                'implements'      => $implements,
                'extends'         => $extends,
                'isClass'         => $class->getName() === 'class',
                'isInterface'     => $class->getName() === 'interface',
                'abstract'        => (string) $class['abstract'] == 'true',
                'deprecated'      => count($class->xpath('docblock/tag[@name="deprecated"]')) > 0,
                'methods'         => $this->parseMethods($class),
                'properties'      => $this->parseProperties($class),
                'constants'       => $this->parseConstants($class),
            );
        }

        $this->classDefinitions = $classNames;
    }

    /**
     * Parses all the method information for a single class or interface.
     *
     * You must pass an xml element that refers to either the class or interface element from
     * structure.xml.
     *
     * @param SimpleXMLElement $class
     *
     * @return array
     */
    protected function parseMethods(SimpleXMLElement $class)
    {
        $methods = array();

        $className = (string) $class->full_name;
        $className = ltrim($className, '\\');

        foreach ($class->method as $method) {
            $methodName = (string) $method->name;

            $return = $method->xpath('docblock/tag[@name="return"]');

            if (count($return)) {
                $return = (string) $return[0]['type'];
            } else {
                $return = 'mixed';
            }

            $arguments = array();

            foreach ($method->argument as $argument) {
                $nArgument = array(
                    'type' => (string) $argument->type,
                    'name' => (string) $argument->name
                );

                $tags = $method->xpath(
                    sprintf('docblock/tag[@name="param" and @variable="%s"]', $nArgument['name'])
                );

                if (count($tags)) {
                    $tag = $tags[0];

                    if ((string) $tag['type']) {
                        $nArgument['type'] = (string) $tag['type'];
                    }

                    if ((string) $tag['description']) {
                        $nArgument['description'] = (string) $tag['description'];
                    }

                    if ((string) $tag['variable']) {
                        $nArgument['name'] = (string) $tag['variable'];
                    }
                }

                $arguments[] = $nArgument;
            }

            $argumentStr = implode(', ', array_map(function ($argument) {
                $return = $argument['name'];

                if ($argument['type']) {
                    $return = $argument['type'] . ' ' . $return;
                }

                return $return;
            }, $arguments));

            $signature = sprintf('%s %s::%s(%s)', $return, $className, $methodName, $argumentStr);

            $methods[$methodName] = array(
                'name'        => $methodName,
                'description' => (string) $method->docblock->description . "\n\n" . (string) $method->docblock->{'long-description'},
                'visibility'  => (string) $method['visibility'],
                'abstract'    => ((string) $method['abstract']) == "true",
                'static'      => ((string) $method['static']) == "true",
                'deprecated'  => count($class->xpath('docblock/tag[@name="deprecated"]')) > 0,
                'signature'   => $signature,
                'arguments'   => $arguments,
                'definedBy'   => $className,
            );
        }

        return $methods;
    }

    /**
     * Parses all property information for a single class or interface.
     *
     * You must pass an xml element that refers to either the class or interface element from
     * structure.xml.
     *
     * @param SimpleXMLElement $class
     *
     * @return array
     */
    protected function parseProperties(SimpleXMLElement $class)
    {
        $properties = array();

        $className = (string) $class->full_name;
        $className = ltrim($className, '\\');

        foreach ($class->property as $xProperty) {
            $type = 'mixed';
            $propName = (string) $xProperty->name;
            $default = (string) $xProperty->default;

            $xVar = $xProperty->xpath('docblock/tag[@name="var"]');

            if (count($xVar)) {
                $type = $xVar[0]->type;
            }

            $visibility = (string) $xProperty['visibility'];
            $signature = sprintf('%s %s %s', $visibility, $type, $propName);

            if ($default) {
                $signature .= ' = ' . $default;
            }

            $properties[$propName] = array(
                'name'        => $propName,
                'type'        => $type,
                'default'     => $default,
                'description' => (string) $xProperty->docblock->description . "\n\n" . (string) $xProperty->docblock->{'long-description'},
                'visibility'  => $visibility,
                'static'      => ((string) $xProperty['static']) == 'true',
                'signature'   => $signature,
                'deprecated'  => count($class->xpath('docblock/tag[@name="deprecated"]')) > 0,
                'definedBy'   => $className,
            );
        }

        return $properties;
    }

    /**
     * Parses all constant information for a single class or interface.
     *
     * You must pass an xml element that refers to either the class or interface element from
     * structure.xml.
     *
     * @param SimpleXMLElement $class
     *
     * @return array
     */
    protected function parseConstants(SimpleXMLElement $class)
    {
        $constants = array();

        $className = (string) $class->full_name;
        $className = ltrim($className, '\\');

        foreach ($class->constant as $xConstant) {
            $name = (string) $xConstant->name;
            $value = (string) $xConstant->value;

            $signature = sprintf('const %s = %s', $name, $value);

            $constants[$name] = array(
                'name'        => $name,
                'description' => (string) $xConstant->docblock->description . "\n\n" . (string) $xConstant->docblock->{'long-description'},
                'signature'   => $signature,
                'value'       => $value,
                'deprecated'  => count($class->xpath('docblock/tag[@name="deprecated"]')) > 0,
                'definedBy'   => $className,
            );
        }

        return $constants;
    }

    /**
     * This method goes through all the class definitions, and adds non-overridden method
     * information from parent classes.
     *
     * @param string $className
     *
     * @return array
     */
    protected function expandMethods($className)
    {
        $class = $this->classDefinitions[$className];

        $newMethods = array();

        foreach (array_merge($class['extends'], $class['implements']) as $extends) {
            if (!isset($this->classDefinitions[$extends])) {
                continue;
            }

            foreach ($this->classDefinitions[$extends]['methods'] as $methodName => $methodInfo) {
                if (!isset($class[$methodName])) {
                    $newMethods[$methodName] = $methodInfo;
                }
            }

            $newMethods = array_merge($newMethods, $this->expandMethods($extends));
        }

        $this->classDefinitions[$className]['methods'] = array_merge(
            $this->classDefinitions[$className]['methods'],
            $newMethods
        );

        return $newMethods;
    }

    /**
     * This method goes through all the class definitions, and adds non-overridden property
     * information from parent classes.
     *
     * @param string $className
     *
     * @return array
     */
    protected function expandProperties($className)
    {
        $class = $this->classDefinitions[$className];

        $newProperties = array();

        foreach (array_merge($class['implements'], $class['extends']) as $extends) {
            if (!isset($this->classDefinitions[$extends])) {
                continue;
            }

            foreach ($this->classDefinitions[$extends]['properties'] as $propertyName => $propertyInfo) {
                if ($propertyInfo['visibility'] === 'private') {
                    continue;
                }

                if (!isset($class[$propertyName])) {
                    $newProperties[$propertyName] = $propertyInfo;
                }
            }

            $newProperties = array_merge($newProperties, $this->expandProperties($extends));
        }

        $this->classDefinitions[$className]['properties'] += $newProperties;

        return $newProperties;
    }
}
