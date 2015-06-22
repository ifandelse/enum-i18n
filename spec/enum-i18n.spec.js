var enumI18n = require( "../" );
var assert = require( "chai" ).assert;

const COLOR_LIST = [ "red", "yellow", "green" ];
const COLOR_OBJECT = {
	red: 1,
	yellow: 2,
	green: 3
};
const BASIC_OPTIONS = {
	name: "colors",
	translate: function( item ) {
		return "colors." + item.key;
	}
};

function basicTests( EnumI18n, frozen ) {
	describe( "when instantiated", function() {
		var subject = new EnumI18n( COLOR_LIST, BASIC_OPTIONS );

		it( 'should create enum with a "name"', function() {
			assert.property( subject, "name" );
			assert.strictEqual( subject.name, BASIC_OPTIONS.name );
		} );

		it( 'should have an "enums" property', function() {
			assert.property( subject, "enums" );
			assert.isArray( subject.enums );
		} );

		it( "should have enum item properties", function() {
			assert.property( subject, "red" );
			assert.property( subject, "yellow" );
			assert.property( subject, "green" );
		} );

		if ( frozen ) {
			it( "should produce a frozen enum", function() {
				try {
					subject.foo = "bar";
				} catch ( e ) {}
				assert.isUndefined( subject.foo );
			} );
		} else {
			it( "should not produce a frozen enum", function() {
				subject.foo = "bar";
				assert.strictEqual( subject.foo, "bar" );
			} );
		}

		describe( "items", function() {
			var item = subject.red;

			it( 'should have a "key" property', function() {
				assert.property( item, "key" );
				assert.strictEqual( item.key, "red" );
			} );

			it( 'should have a "value" property', function() {
				assert.property( item, "value" );
				assert.strictEqual( item.value, 1 );
			} );

			it( 'should have an "enum" property', function() {
				assert.property( item, "enum" );
				assert.strictEqual( item.enum, subject );
			} );

			it( 'should have a "toDescription" method', function() {
				assert.property( item, "toDescription" );
				assert.isFunction( item.toDescription );
			} );

			it( '"toDescription" method should return translation', function() {
				assert.strictEqual( item.toDescription(), "colors.red" );
			} );

			if ( frozen ) {
				it( "should produce frozen enum items", function() {
					try {
						item.foo = "bar";
					} catch ( e ) {}
					assert.isUndefined( item.foo );
				} );
			} else {
				it( "should not produce frozen enum items", function() {
					item.foo = "bar";
					assert.strictEqual( item.foo, "bar" );
				} );
			}
		} );
	} );
}

describe( "EnumI18n", function() {
	it( 'factory throws error if called with a "name" option', function() {
		assert.throws( function() {
			enumI18n( { name: "not allowed" } );
		} );
	} );

	describe( "constructor with no defaults", function() {
		var EnumI18n = enumI18n();

		it( 'should throw error if missing "name" option', function() {
			assert.throws( function() {
				new EnumI18n( COLOR_LIST, { translate: function() {} } );
			} );
		} );

		it( 'should throw error if missing "translate" option', function() {
			assert.throws( function() {
				new EnumI18n( COLOR_LIST, { name: "colors" } );
			} );
		} );

		basicTests( EnumI18n, false );
	} );

	describe( 'constructor with default "translate" function', function() {
		var EnumI18n = enumI18n( {
			translate: function( item ) {
				return "i.am.enum." + item.enum.name + "." + item.key;
			}
		} );

		it( 'should throw error if missing "name" option', function() {
			assert.throws( function() {
				new EnumI18n( COLOR_LIST, { translate: function() {} } );
			} );
		} );

		it( 'should not require "translate" option', function() {
			assert.doesNotThrow( function() {
				new EnumI18n( COLOR_LIST, { name: "colors" } );
			} );
		} );

		describe( "", function() {} );

		basicTests( EnumI18n, false );
	} );

	describe( 'constructor with default "freez" option', function() {
		var EnumI18n = enumI18n( {
			freez: true
		} );

		basicTests( EnumI18n, true );
	} );
} );
