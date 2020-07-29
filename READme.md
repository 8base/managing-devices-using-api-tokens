# Managing Authorized Device using API Tokens

When we think of authorization in app development, it's usually from the perspective of a user that has specific roles and permissions. For example, a fitness app that tracks a user's workouts might allow an _Athlete_ (user role) to create journal entries, as well only read their own journal entries from the API. Most applications that are user-centric and data-driven end up thinking through and defining these types of scenarios; _who_ can do _what_?

That said, not all applications are centered around an individually logged-in user. It's not uncommon that authorization for a given application needs to be handled within the context of a device. Think of Internet of Things (IoT) devices, VR headsets, registration kiosks, and others where the device itself - or installed application - is the authenticated entity.

Sometimes, this type of authorization is used purely for secure machine-to-machine applications, such as a manufacturing monitoring devices where sensors send equipment data to a central monitoring system. Other times, a single device is authorized so that multiple-users can access it at a given time, like an event registration kiosk. Regardless of the specific usecase, what's required is a reliable system for authenticating devices, generating API tokens, assigning those tokens the necessary authorizations, and returning a credential back to the device.
